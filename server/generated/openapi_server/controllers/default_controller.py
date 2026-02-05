from typing import List, Dict
from aiohttp import web

from generated.openapi_server.models.pair_post_request import PairPostRequest
from generated.openapi_server.models.robot_register_post_request import RobotRegisterPostRequest
from generated.openapi_server.models.dialog_request import DialogRequest
from generated.openapi_server import util

from services.api.command_service import (
    handle_command_get,
    handle_pair_post,
    handle_register_post,
    handle_status_get,
    handle_run_dialog_post
)

async def command_get(request: web.Request, robot_id) -> web.Response:
    """get next command from server

    

    :param robot_id: The unique identifier for the robot
    :type robot_id: str

    """
    return handle_command_get(robot_id)

async def command_run_dialog_post(request: web.Request, body) -> web.Response:
    """Enqueue a series of dialog actions for the robot

    

    :param body: 
    :type body: dict | bytes

    """
    body = DialogRequest.from_dict(body)
    return handle_run_dialog_post(body)


async def pair_post(request: web.Request, body) -> web.Response:
    """Pair with the server using a pairing token

    

    :param body: 
    :type body: dict | bytes

    """
    body = PairPostRequest.from_dict(body)
    return handle_pair_post(body)


async def robot_register_post(request: web.Request, body) -> web.Response:
    """Register a new robot with the server

    

    :param body: 
    :type body: dict | bytes

    """
    body = RobotRegisterPostRequest.from_dict(body)
    return handle_register_post(body)


async def status_get(request: web.Request, ) -> web.Response:
    """Get server status

    


    """
    return handle_status_get()
