# represents the robot, handling sending commands and audio stream data

import asyncio
import socket

class Robot:
  def __init__(self, in_socket, out_socket):
    self.in_socket = in_socket
    self.out_socket = out_socket

  async def send_command(self, command):
    """Send a command to the robot."""
    #await self.out_socket.send(command)
    print(f"Command sent: {command}")