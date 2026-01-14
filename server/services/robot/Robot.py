# represents the robot, handling sending commands and audio stream data

import asyncio
import socket

from services.connections.SharedAudioSocket import SharedAudioSocket, StreamSubscription
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

  async def open_audio_stream(
    self,
    local_ip: str,
    callback = None,
  ) -> StreamSubscription:
    """Open a UDP audio stream to the robot's microphone port for receiving audio data."""
    demux = await SharedAudioSocket.get_or_create(
      ip=local_ip,
      port=self.audio_port
    )
    subscription = demux.register(
      robot_id=self.id,
      source_ip=self.ip_address,
      playback_port=50002,
      callback=callback
    )
    return subscription