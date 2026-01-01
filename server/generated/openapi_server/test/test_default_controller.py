import unittest

from flask import json

from openapi_server.models.command_listen_keyword_post200_response import CommandListenKeywordPost200Response  # noqa: E501
from openapi_server.models.command_listen_keyword_post_request import CommandListenKeywordPostRequest  # noqa: E501
from openapi_server.models.command_listen_silence_post200_response import CommandListenSilencePost200Response  # noqa: E501
from openapi_server.models.command_listen_silence_post_request import CommandListenSilencePostRequest  # noqa: E501
from openapi_server.models.command_speak_post200_response import CommandSpeakPost200Response  # noqa: E501
from openapi_server.models.command_speak_post_request import CommandSpeakPostRequest  # noqa: E501
from openapi_server.models.status_get200_response import StatusGet200Response  # noqa: E501
from openapi_server.test import BaseTestCase


class TestDefaultController(BaseTestCase):
    """DefaultController integration test stubs"""

    def test_command_listen_keyword_post(self):
        """Test case for command_listen_keyword_post

        Send a command for the robot to listen until it detects a keyword
        """
        command_listen_keyword_post_request = openapi_server.CommandListenKeywordPostRequest()
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/command/listenKeyword',
            method='POST',
            headers=headers,
            data=json.dumps(command_listen_keyword_post_request),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_command_listen_silence_post(self):
        """Test case for command_listen_silence_post

        Send a command for the robot to listen until it detects silence
        """
        command_listen_silence_post_request = openapi_server.CommandListenSilencePostRequest()
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/command/listenSilence',
            method='POST',
            headers=headers,
            data=json.dumps(command_listen_silence_post_request),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_command_speak_post(self):
        """Test case for command_speak_post

        Send a speak command to the server
        """
        command_speak_post_request = openapi_server.CommandSpeakPostRequest()
        headers = { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/command/speak',
            method='POST',
            headers=headers,
            data=json.dumps(command_speak_post_request),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_status_get(self):
        """Test case for status_get

        Get server status
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/status',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
