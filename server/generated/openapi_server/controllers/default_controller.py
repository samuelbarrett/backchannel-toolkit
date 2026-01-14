from typing import List, Dict
from aiohttp import web

from generated.openapi_server.models.command_get200_response import CommandGet200Response
from generated.openapi_server.models.command_listen_keyword_post200_response import CommandListenKeywordPost200Response
from generated.openapi_server.models.command_listen_keyword_post_request import CommandListenKeywordPostRequest
from generated.openapi_server.models.command_listen_silence_post200_response import CommandListenSilencePost200Response
from generated.openapi_server.models.command_listen_silence_post_request import CommandListenSilencePostRequest
from generated.openapi_server.models.command_speak_post200_response import CommandSpeakPost200Response
from generated.openapi_server.models.command_speak_post_request import CommandSpeakPostRequest
from generated.openapi_server.models.pair_post200_response import PairPost200Response
from generated.openapi_server.models.pair_post400_response import PairPost400Response
from generated.openapi_server.models.pair_post409_response import PairPost409Response
from generated.openapi_server.models.pair_post_request import PairPostRequest
from generated.openapi_server.models.robot_register_post409_response import RobotRegisterPost409Response
from generated.openapi_server.models.robot_register_post_request import RobotRegisterPostRequest
from generated.openapi_server.models.status_get200_response import StatusGet200Response
from generated.openapi_server.models.dialog_request import DialogRequest
from generated.openapi_server import util

from services.api.command_service import (
    handle_command_get,
    handle_command_listen_keyword_post,
    handle_command_listen_silence_post,
    handle_command_speak_post,
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

async def command_listen_keyword_post(request: web.Request, body) -> web.Response:
    """Send a command for the robot to listen until it detects a keyword

    

    :param body: 
    :type body: dict | bytes

    """
    body = CommandListenKeywordPostRequest.from_dict(body)
    return handle_command_listen_keyword_post(body)


async def command_listen_silence_post(request: web.Request, body) -> web.Response:
    """Send a command for the robot to listen until it detects silence

    

    :param body: 
    :type body: dict | bytes

    """
    body = CommandListenSilencePostRequest.from_dict(body)
    return handle_command_listen_silence_post(body)


async def command_speak_post(request: web.Request, body) -> web.Response:
    """Send a speak command to the server

    

    :param body: 
    :type body: dict | bytes

    """
    body = CommandSpeakPostRequest.from_dict(body)
    return handle_command_speak_post(body)


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
