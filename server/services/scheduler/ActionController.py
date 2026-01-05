import asyncio
from typing import Any, Dict
from services.scheduler.Scheduler import Scheduler
from services.robot.RobotAction import RobotAction

"""
ActionController receives actions, queues them, and runs them in FIFO order using the provided Scheduler.
"""
class ActionController:
  def __init__(self, scheduler: Scheduler):
    self.scheduler = scheduler
    self.action_queue: asyncio.Queue[RobotAction] = asyncio.Queue()
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

  async def enqueue(self, session: RobotAction):
    await self.action_queue.put(session)

  async def _runner(self):
    while True:
      action = await self.action_queue.get()
      try:
        print(f"[Controller] Starting session {action.action_id}")
        await action.run(self.scheduler)
        print(f"[Controller] Finished session {action.action_id}")
      except Exception as e:
        print(f"[Controller] Session {action.action_id} error: {e}")
      finally:
        self.action_queue.task_done()

