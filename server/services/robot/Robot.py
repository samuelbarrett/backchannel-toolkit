# represents the robot, handling sending commands and audio stream data

import asyncio
import socket

from services.robot.behaviors.RobotAction import RobotAction
from services.controller.ActionController import ActionController

class Robot:
  def __init__(self, id):
    self.id = id
    self.output_queue: asyncio.Queue = asyncio.Queue()
    self._controller = ActionController(self.output_queue)

    self._controller.start()

  def get_id(self):
    return self.id

  def enqueue_action(self, action: RobotAction):
    """Enqueue a RobotAction to be executed by the robot."""
    self._controller.enqueue(action)

  def get_next_behavior(self):
    """Get the next behavior from the robot's behavior queue."""
    return self.output_queue.get()
  

