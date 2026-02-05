"""Service handlers for OpenAPI endpoints.

Place business logic that the generated controllers delegate to here. Keep
these functions simple and return values compatible with the generated
controller expectations (model instances, tuples, or simple serializable
objects).
"""

from generated.openapi_server.models.command_get200_response import CommandGet200Response  # noqa: E501
from generated.openapi_server.models.behavior import Behavior  # noqa: E501
from generated.openapi_server.models.pair_post200_response import PairPost200Response  # noqa: E501
from generated.openapi_server.models.pair_post409_response import PairPost409Response  # noqa: E501
from generated.openapi_server.models.pair_post_request import PairPostRequest  # noqa: E501
from generated.openapi_server.models.robot_register_post409_response import RobotRegisterPost409Response  # noqa: E501
from generated.openapi_server.models.robot_register_post_request import RobotRegisterPostRequest  # noqa: E501
from generated.openapi_server.models.status_get200_response import StatusGet200Response  # noqa: E501
from generated.openapi_server.models.dialog_request import DialogRequest  # noqa: E501
from generated.openapi_server import util

from generated.openapi_server.models.style import Style
from services.robot.behaviors.primary.base import PrimaryBehavior, PrimaryFactory
from services.robot.behaviors.RobotAction import RobotAction
import services.robot.registry as registry
from services.robot.Robot import Robot

import secrets

async def handle_command_get(command_get_request):
  """Handle `command_get` endpoint.

  Args:
    command_get_request: Parsed request model (or raw dict/None).

  Returns:
    A serializable response (model instance, dict, tuple).
  """
  robot: Robot = registry.find_by_id(int(command_get_request))
  if robot is not None:
    behavior: Behavior = await robot.get_next_behavior()
    return CommandGet200Response(behavior=behavior)


async def handle_run_dialog_post(request_model: DialogRequest):
  """Enqueue a series of dialog actions for the robot."""
  print("handle_run_dialog_post: %s", request_model)
  robot: Robot = registry.find_by_id(int(request_model.robot_id))
  cmds = request_model.dialog
  for cmd in cmds:
    kind = cmd.type
    style: Style = cmd.style
    if kind == "say":
      action = PrimaryFactory.build(kind="speak", text=cmd.speech)
    elif kind == "listen_keyword":
      action = PrimaryFactory.build(kind="listen_keyword", keywords=cmd.keywords)
    elif kind == "listen_until_silence":
      action = PrimaryFactory.build(kind="listen_until_silence")
    else:
      print(f"Unknown dialog command type: {kind}")
      break
    robot_action: RobotAction = RobotAction(
      primary_behavior=action,
      robot=robot,
      style=style,
    )
    await robot.enqueue_action(robot_action)
  return {"status": "queued"}


def handle_pair_post(request_model: PairPostRequest):
  print("handle_pair_post: %s", request_model)
  robot_id: int = int(request_model.robot_id)
  robot: Robot = registry.find_by_id(robot_id)
  if robot is None:
    print(f"Pairing failed: Robot id {robot_id} not found.")
    return PairPost409Response(error=f"Robot with id {robot_id} not found.")
  elif robot.get_client() is not None:
    print(f"Pairing failed: Robot id {robot_id} already paired.")
    return PairPost409Response(error=f"Robot with id {robot_id} already paired.")
  else:
    pairing_token: str = _generate_token()
    robot.set_client(pairing_token)
    print(f"Paired with Robot id {robot_id} successfully.")
    return PairPost200Response(pairing_token=pairing_token)


def handle_status_get():
  print("handle_status_get called")
  return StatusGet200Response(status="ok")


async def handle_register_post(request_model: RobotRegisterPostRequest):
  print("handle_register_post: %s", request_model)
  robot_id: int = int(request_model.robot_id)
  added: bool = await registry.add(
    robot_id,
    request_model.ip,
    request_model.audio_port,
  )
  if added:
    print(f"Robot with id {robot_id} registered successfully.")
    return {"status": "ok", "action": "register"}
  else:
    print(f"Robot with id {robot_id} registration failed: already exists.")
    return RobotRegisterPost409Response(error=f"Robot with id {robot_id} already registered.")


def _generate_token() -> str:
  """Generate a random token string."""
  return secrets.token_hex(8)