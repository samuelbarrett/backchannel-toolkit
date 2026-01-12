import asyncio
from typing import Any, Dict
from services.robot.behaviors.RobotAction import RobotAction

"""
ActionController receives actions, queues them, and runs them in FIFO order using the provided Scheduler.
"""
class ActionController:
  def __init__(self, output_queue: asyncio.Queue):
    self._action_queue: asyncio.Queue[RobotAction] = asyncio.Queue()
    self._output_queue = output_queue
    self._runner_task: asyncio.Task | None = None
    self._worker_count = 1  # process sessions sequentially by default

  async def start(self):
    if self._runner_task is None:
      self._runner_task = asyncio.create_task(self._runner())

  async def stop(self):
    if self._runner_task:
      self._runner_task.cancel()
      try:
        await self._runner_task
      except asyncio.CancelledError:
        pass
  
  async def empty_queue(self, queue: asyncio.Queue):
    while not queue.empty():
      try:
        queue.get_nowait()
        queue.task_done()
      except asyncio.QueueEmpty:
        pass


  async def enqueue(self, session: RobotAction):
    await self._action_queue.put(session)

  async def _runner(self):
    while True:
      action = await self._action_queue.get()
      try:
        print(f"[Controller] Starting session {action}")
        await action.run(self._output_queue)
        print(f"[Controller] Finished session {action}")
      except Exception as e:
        print(f"[Controller] Session {action} error: {e}")
      finally:
        self._action_queue.task_done()
        await self.empty_queue(self._output_queue)

