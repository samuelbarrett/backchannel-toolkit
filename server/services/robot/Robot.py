# represents the robot, handling sending commands and audio stream data

import asyncio
import socket

from services.robot.behaviors.RobotAction import RobotAction
from services.controller.ActionController import ActionController

class Robot:
  def __init__(self, id: int, ip_address: str, audio_port: int):
    self.id = id
    self.ip_address = ip_address
    self.audio_port = audio_port
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
      remote_addr=(self.ip_address, self.audio_port)
    )
    return transport, protocol
  
  async def open_mic_stream(self, local_ip, receive_callback=None) -> asyncio.StreamReader:
    """Open a UDP stream to the robot's microphone port for receiving audio data."""
    loop = asyncio.get_running_loop()
    transport, protocol = await loop.create_datagram_endpoint(
      lambda: _UDPStreamProtocol(receive_callback),
      local_addr=(local_ip, self.audio_port)
    )
    return transport, protocol

class _UDPStreamProtocol(asyncio.DatagramProtocol):
  def __init__(self, receive_callback=None):
    self.transport: asyncio.DatagramTransport | None = None
    self.receive_callback = receive_callback

  def connection_made(self, transport):
    self.transport = transport

  def datagram_received(self, data, addr):
    if self.receive_callback:
      self.receive_callback(data, addr)

  def close(self):
    if self.transport:
      self.transport.close()
      self.transport = None