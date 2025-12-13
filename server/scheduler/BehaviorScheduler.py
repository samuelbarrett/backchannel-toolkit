import asyncio
import random

from server.robot.events.RobotEvent import RobotEvent
from server.robot.RobotTask import RobotTask

class BehaviorScheduler:
  def __init__(self, robot):
    self.event_queue = asyncio.Queue()
    self.robot = robot
    self._dispatcher_task = None
    self._behavior_tasks = []

  async def start_dispatcher(self):
    if self._dispatcher_task is None or self._dispatcher_task.done():
      self._dispatcher_task = asyncio.create_task(self._event_dispatcher())

  async def _event_dispatcher(self):
    while True:
      event: RobotEvent = await self.event_queue.get()
      await self.robot.send_command(event.type, **event.params)
      self.event_queue.task_done()

  async def start_behaviors(self, behaviors):
    # behaviors: list of coroutine functions accepting (event_queue,)
    self._behavior_tasks = [asyncio.create_task(b(self.event_queue)) for b in behaviors]

  async def stop_behaviors(self):
    for task in self._behavior_tasks:
      task.cancel()
    await asyncio.gather(*self._behavior_tasks, return_exceptions=True)
    self._behavior_tasks = []

  async def run_task(self, robot_task: RobotTask):
    """
    Run a RobotTask which has a primary coroutine and behavior coroutines.
    """
    await self.start_dispatcher()
    await self.start_behaviors(robot_task.behavior_coros)
    try:
      await robot_task.primary_coro
    finally:
      await self.stop_behaviors()

# # Example usage
# async def main():
#     robot = Robot()
#     scheduler = BehaviorScheduler(robot)
#     # Run with audio stream and two behaviors
#     await scheduler.run_with_audio(audio_stream("send", duration=5), [nod_behavior, look_around_behavior])

# To run:
# asyncio.run(main())# Handles scheduling tasks for the robot
