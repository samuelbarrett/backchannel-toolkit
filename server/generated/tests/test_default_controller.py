# coding: utf-8

import pytest
import json
from aiohttp import web

from openapi_server.models.command_get200_response import CommandGet200Response
from openapi_server.models.command_listen_keyword_post200_response import CommandListenKeywordPost200Response
from openapi_server.models.command_listen_keyword_post_request import CommandListenKeywordPostRequest
from openapi_server.models.command_listen_silence_post200_response import CommandListenSilencePost200Response
from openapi_server.models.command_listen_silence_post_request import CommandListenSilencePostRequest
from openapi_server.models.command_speak_post200_response import CommandSpeakPost200Response
from openapi_server.models.command_speak_post_request import CommandSpeakPostRequest
from openapi_server.models.pair_post200_response import PairPost200Response
from openapi_server.models.pair_post400_response import PairPost400Response
from openapi_server.models.pair_post409_response import PairPost409Response
from openapi_server.models.pair_post_request import PairPostRequest
from openapi_server.models.robot_register_post409_response import RobotRegisterPost409Response
from openapi_server.models.status_get200_response import StatusGet200Response


pytestmark = pytest.mark.asyncio

async def test_command_get(client):
    """Test case for command_get

    get next command from server
    """
    params = [('robot_id', 'robot_id_example')]
    headers = { 
        'Accept': 'application/json',
    }
    response = await client.request(
        method='GET',
        path='/command',
        headers=headers,
        params=params,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_command_listen_keyword_post(client):
    """Test case for command_listen_keyword_post

    Send a command for the robot to listen until it detects a keyword
    """
    body = openapi_server.CommandListenKeywordPostRequest()
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'PairingToken': 'special-key',
    }
    response = await client.request(
        method='POST',
        path='/command/listenKeyword',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_command_listen_silence_post(client):
    """Test case for command_listen_silence_post

    Send a command for the robot to listen until it detects silence
    """
    body = openapi_server.CommandListenSilencePostRequest()
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'PairingToken': 'special-key',
    }
    response = await client.request(
        method='POST',
        path='/command/listenSilence',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_command_speak_post(client):
    """Test case for command_speak_post

    Send a speak command to the server
    """
    body = openapi_server.CommandSpeakPostRequest()
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'PairingToken': 'special-key',
    }
    response = await client.request(
        method='POST',
        path='/command/speak',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_pair_post(client):
    """Test case for pair_post

    Pair with the server using a pairing token
    """
    body = openapi_server.PairPostRequest()
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    response = await client.request(
        method='POST',
        path='/pair',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_robot_register_post(client):
    """Test case for robot_register_post

    Register a new robot with the server
    """
    body = openapi_server.PairPostRequest()
    headers = { 
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
    response = await client.request(
        method='POST',
        path='/robot/register',
        headers=headers,
        json=body,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')


pytestmark = pytest.mark.asyncio

async def test_status_get(client):
    """Test case for status_get

    Get server status
    """
    headers = { 
        'Accept': 'application/json',
    }
    response = await client.request(
        method='GET',
        path='/status',
        headers=headers,
        )
    assert response.status == 200, 'Response body is : ' + (await response.read()).decode('utf-8')

