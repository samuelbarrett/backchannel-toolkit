import asyncio
import random
import time
from typing import Any, Dict
import aiohttp

# Simple event shape
# { "type": "nod" | "gaze" | "speech", "timestamp": ..., "payload": {...} }

class Scheduler:
  def __init__(self, robot_url: str):
    self.robot_url = robot_url
    self.queue: asyncio.Queue[Dict[str, Any]] = asyncio.Queue()
    self._task: asyncio.Task | None = None
    self._session = aiohttp.ClientSession()

  async def start(self):
    if self._task is None:
      self._task = asyncio.create_task(self._run())

  async def stop(self):
    if self._task:
      self._task.cancel()
      try:
        await self._task
      except asyncio.CancelledError:
        pass
    await self._session.close()

  async def _run(self):
    while True:
      event = await self.queue.get()
      try:
        await self._send_to_robot(event)
      except Exception as e:
        # For research: log and continue. Add retry/backoff if desired.
        print(f"[Scheduler] Error sending event: {e}")
      finally:
        self.queue.task_done()

  async def _send_to_robot(self, event: Dict[str, Any]):
    # Simple HTTP POST; adapt to UDP if you prefer.
    async with self._session.post(self.robot_url, json=event, timeout=2) as resp:
      if resp.status != 200:
        body = await resp.text()
        print(f"[Scheduler] Non-OK response {resp.status}: {body}")
      else:
        # Optionally read response
        await resp.text()
    # throttle a little to avoid spamming
    await asyncio.sleep(0.0)
