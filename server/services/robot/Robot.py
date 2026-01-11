# represents the robot, handling sending commands and audio stream data

import asyncio
import socket

from services.robot.behaviors.RobotAction import RobotAction
from services.controller.ActionController import ActionController

class Robot:
  def __init__(self, id: int, ip_address: str, voice_port: int, microphone_port: int):
    self.id = id
    self.ip_address = ip_address
    self.voice_port = voice_port
    self.microphone_port = microphone_port
    self.client = None
    self.output_queue: asyncio.Queue = asyncio.Queue()
    self._controller = ActionController(self.output_queue)

  async def initialize(self):
    await self._controller.start()

  def get_id(self) -> int:
    return self.id

  async def enqueue_action(self, action: RobotAction):
    """Enqueue a RobotAction to be executed by the robot."""
    await self._controller.enqueue(action)

  async def get_next_behavior(self):
    """Get the next behavior from the robot's behavior queue."""
    return await self.output_queue.get()
  
  def get_client(self) -> str | None:
    return self.client
  
  def set_client(self, client: str):
    self.client = client

  async def open_voice_stream(self) -> tuple[asyncio.StreamReader, asyncio.StreamWriter]:
    """Open a UDP stream to the robot's voice port for sending audio data."""
    loop = asyncio.get_running_loop()
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: _UDPStreamProtocol(),
        remote_addr=(self.ip_address, self.voice_port)
    )
    return transport, protocol
  
  async def open_mic_stream(self) -> asyncio.StreamReader:
    """Open a UDP stream to the robot's microphone port for receiving audio data."""
    loop = asyncio.get_running_loop()
    transport, protocol = await loop.create_datagram_endpoint(
        lambda: _UDPStreamProtocol(),
        remote_addr=(self.ip_address, self.microphone_port)
    )
    return transport, protocol

class _UDPStreamProtocol(asyncio.DatagramProtocol):
    def __init__(self):
        self.transport: asyncio.DatagramTransport | None = None

    def connection_made(self, transport):
        self.transport = transport

    def close(self):
        if self.transport:
            self.transport.close()
            self.transport = None