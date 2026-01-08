import connexion
from typing import Dict
from typing import Tuple
from typing import Union

from openapi_server.models.command_get200_response import CommandGet200Response  # noqa: E501
from openapi_server.models.command_listen_keyword_post200_response import CommandListenKeywordPost200Response  # noqa: E501
from openapi_server.models.command_listen_keyword_post_request import CommandListenKeywordPostRequest  # noqa: E501
from openapi_server.models.command_listen_silence_post200_response import CommandListenSilencePost200Response  # noqa: E501
from openapi_server.models.command_listen_silence_post_request import CommandListenSilencePostRequest  # noqa: E501
from openapi_server.models.command_speak_post200_response import CommandSpeakPost200Response  # noqa: E501
from openapi_server.models.command_speak_post_request import CommandSpeakPostRequest  # noqa: E501
from openapi_server.models.pair_post200_response import PairPost200Response  # noqa: E501
from openapi_server.models.pair_post400_response import PairPost400Response  # noqa: E501
from openapi_server.models.pair_post409_response import PairPost409Response  # noqa: E501
from openapi_server.models.pair_post_request import PairPostRequest  # noqa: E501
from openapi_server.models.robot_register_post409_response import RobotRegisterPost409Response  # noqa: E501
from openapi_server.models.status_get200_response import StatusGet200Response  # noqa: E501
from openapi_server import util


def command_get(body):  # noqa: E501
    """get next command from server

     # noqa: E501

    :param pair_post_request: 
    :type pair_post_request: dict | bytes

    :rtype: Union[CommandGet200Response, Tuple[CommandGet200Response, int], Tuple[CommandGet200Response, int, Dict[str, str]]
    """
    pair_post_request = body
    if connexion.request.is_json:
        pair_post_request = PairPostRequest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def command_listen_keyword_post(body):  # noqa: E501
    """Send a command for the robot to listen until it detects a keyword

     # noqa: E501

    :param command_listen_keyword_post_request: 
    :type command_listen_keyword_post_request: dict | bytes

    :rtype: Union[CommandListenKeywordPost200Response, Tuple[CommandListenKeywordPost200Response, int], Tuple[CommandListenKeywordPost200Response, int, Dict[str, str]]
    """
    command_listen_keyword_post_request = body
    if connexion.request.is_json:
        command_listen_keyword_post_request = CommandListenKeywordPostRequest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def command_listen_silence_post(body):  # noqa: E501
    """Send a command for the robot to listen until it detects silence

     # noqa: E501

    :param command_listen_silence_post_request: 
    :type command_listen_silence_post_request: dict | bytes

    :rtype: Union[CommandListenSilencePost200Response, Tuple[CommandListenSilencePost200Response, int], Tuple[CommandListenSilencePost200Response, int, Dict[str, str]]
    """
    command_listen_silence_post_request = body
    if connexion.request.is_json:
        command_listen_silence_post_request = CommandListenSilencePostRequest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def command_speak_post(body):  # noqa: E501
    """Send a speak command to the server

     # noqa: E501

    :param command_speak_post_request: 
    :type command_speak_post_request: dict | bytes

    :rtype: Union[CommandSpeakPost200Response, Tuple[CommandSpeakPost200Response, int], Tuple[CommandSpeakPost200Response, int, Dict[str, str]]
    """
    command_speak_post_request = body
    if connexion.request.is_json:
        command_speak_post_request = CommandSpeakPostRequest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def pair_post(body):  # noqa: E501
    """Pair with the server using a pairing token

     # noqa: E501

    :param pair_post_request: 
    :type pair_post_request: dict | bytes

    :rtype: Union[PairPost200Response, Tuple[PairPost200Response, int], Tuple[PairPost200Response, int, Dict[str, str]]
    """
    pair_post_request = body
    if connexion.request.is_json:
        pair_post_request = PairPostRequest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def robot_register_post(body):  # noqa: E501
    """Register a new robot with the server

     # noqa: E501

    :param pair_post_request: 
    :type pair_post_request: dict | bytes

    :rtype: Union[None, Tuple[None, int], Tuple[None, int, Dict[str, str]]
    """
    pair_post_request = body
    if connexion.request.is_json:
        pair_post_request = PairPostRequest.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def status_get():  # noqa: E501
    """Get server status

     # noqa: E501


    :rtype: Union[StatusGet200Response, Tuple[StatusGet200Response, int], Tuple[StatusGet200Response, int, Dict[str, str]]
    """
    return 'do some magic!'
