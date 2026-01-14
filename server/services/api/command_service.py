"""Service handlers for OpenAPI endpoints.

Place business logic that the generated controllers delegate to here. Keep
these functions simple and return values compatible with the generated
controller expectations (model instances, tuples, or simple serializable
objects).
"""

from generated.openapi_server.models.command_get200_response import CommandGet200Response  # noqa: E501
from generated.openapi_server.models.behavior import Behavior  # noqa: E501
from generated.openapi_server.models.command_listen_keyword_post200_response import CommandListenKeywordPost200Response  # noqa: E501
from generated.openapi_server.models.command_listen_keyword_post_request import CommandListenKeywordPostRequest  # noqa: E501
from generated.openapi_server.models.command_listen_silence_post200_response import CommandListenSilencePost200Response  # noqa: E501
from generated.openapi_server.models.command_listen_silence_post_request import CommandListenSilencePostRequest  # noqa: E501
from generated.openapi_server.models.command_speak_post200_response import CommandSpeakPost200Response  # noqa: E501
from generated.openapi_server.models.command_speak_post_request import CommandSpeakPostRequest  # noqa: E501
from generated.openapi_server.models.pair_post200_response import PairPost200Response  # noqa: E501
from generated.openapi_server.models.pair_post400_response import PairPost400Response  # noqa: E501
from generated.openapi_server.models.pair_post409_response import PairPost409Response  # noqa: E501
from generated.openapi_server.models.pair_post_request import PairPostRequest  # noqa: E501
from generated.openapi_server.models.robot_register_post409_response import RobotRegisterPost409Response  # noqa: E501
from generated.openapi_server.models.robot_register_post_request import RobotRegisterPostRequest  # noqa: E501
from generated.openapi_server.models.status_get200_response import StatusGet200Response  # noqa: E501
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


async def handle_command_listen_keyword_post(request_model: CommandListenKeywordPostRequest):
  """Genereate a listen for keyword action for the robot."""
  print("handle_command_listen_keyword_post: %s", request_model)
  style: Style = request_model.style
  robot: Robot = registry.find_by_id(int(request_model.robot_id))
  listen_keywords_behavior: PrimaryBehavior = PrimaryFactory.build(
    kind="listen_keyword",
    keywords=request_model.keyword,
  )
  action: RobotAction = RobotAction(
    primary_behavior=listen_keywords_behavior,
    robot=robot,
    style=style,
  )
  # enqueue the action to the robot's controller
  await robot.enqueue_action(action)
  return {"status": "ok", "action": "listen_keyword"}


async def handle_command_listen_silence_post(request_model: CommandListenSilencePostRequest):
  """Generate a listen until silence action for the robot."""
  print("handle_command_listen_silence_post:", request_model)
  style: Style = request_model.style
  robot: Robot = registry.find_by_id(int(request_model.robot_id))
  listen_behavior: PrimaryBehavior = PrimaryFactory.build(
    kind="listen_until_silence"
  )
  action: RobotAction = RobotAction(
    primary_behavior=listen_behavior,
    robot=robot,
    style=style,
  )
  # enqueue the action to the robot's controller
  await robot.enqueue_action(action)
  return CommandListenSilencePost200Response(received_command="listenSilence command received successfully")


async def handle_command_speak_post(request_model: CommandSpeakPostRequest):
  """Generate a speaking action for the robot."""
  print("handle_command_speak_post: %s", request_model)
  robot: Robot = registry.find_by_id(int(request_model.robot_id))
  speak_behavior: PrimaryBehavior = PrimaryFactory.build(
    kind="speak",
    text=request_model.text,
  )
  action: RobotAction = RobotAction(
    primary_behavior=speak_behavior,
    robot=robot,
    style=request_model.style,
  )
  await robot.enqueue_action(action)
  return {"status": "ok", "action": "speak"}


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