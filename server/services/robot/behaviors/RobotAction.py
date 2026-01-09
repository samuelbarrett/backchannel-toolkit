import asyncio
import random
import time
from typing import Any, Dict

"""
RobotAction represents a single primary action of generated behaviors. It manages multiple sub-behaviors (like nodding, gazing)
that run concurrently while a primary behavior (like TTS playback or listening) is active.
"""
class RobotAction:
  def __init__(self, action_id: str, config: Dict[str, Any]):
    """
    config example:
    {
      "nod": {"enabled": True, "freq": 0.5},  # nods per second (avg)
      "gaze": {"enabled": True, "freq": 0.2},
      "duration": 5.0  # seconds for primary behavior
    }
    """
    self.action_id = action_id
    self.config = config
    self._stop_event = asyncio.Event()
    self._tasks: list[asyncio.Task] = []

  async def run(self, output_queue: asyncio.Queue):
    """
    Run this action and its behaviors: spawn sub-behaviors, run primary, then stop subs cleanly.
    """
    # spawn sub-behaviors
    if self.config.get("nod", {}).get("enabled"):
      t = asyncio.create_task(self._nodder(output_queue))
      self._tasks.append(t)
    if self.config.get("gaze", {}).get("enabled"):
      t = asyncio.create_task(self._gazer(output_queue))
      self._tasks.append(t)
    # audio/tss or listening primary
    primary_task = asyncio.create_task(self._primary_behavior(output_queue))

    try:
      await primary_task
    finally:
      # signal sub-behaviors to stop and let them finish
      self._stop_event.set()
      # wait a short time for graceful finish, then cancel leftovers
      await self._wait_and_cancel_subtasks(timeout=1.0)

  async def _wait_and_cancel_subtasks(self, timeout: float):
    if not self._tasks:
      return
    done, pending = await asyncio.wait(self._tasks, timeout=timeout)
    for p in pending:
      p.cancel()
    # await cancellations
    if pending:
      await asyncio.gather(*pending, return_exceptions=True)

  async def _nodder(self, out_queue: asyncio.Queue):
    """Emit head-nod events with some human-like jitter until stop."""
    freq = float(self.config.get("nod", {}).get("freq", 0.5))  # nods per sec
    if freq <= 0:
      return
    base_interval = 1.0 / freq
    while not self._stop_event.is_set():
      # add jitter
      interval = max(0.05, random.gauss(base_interval, base_interval * 0.2))
      await asyncio.sleep(interval)
      if self._stop_event.is_set():
        break
      event = {
        "type": "nod",
        "action_id": self.action_id,
        "timestamp": time.time(),
        "payload": {"amplitude": random.uniform(0.5, 1.0)}
      }
      await out_queue.put(event)

  async def _gazer(self, out_queue: asyncio.Queue):
    """Emit gaze shift events."""
    freq = float(self.config.get("gaze", {}).get("freq", 0.2))
    if freq <= 0:
      return
    base_interval = 1.0 / freq
    while not self._stop_event.is_set():
      interval = max(0.05, random.gauss(base_interval, base_interval * 0.3))
      await asyncio.sleep(interval)
      if self._stop_event.is_set():
        break
      event = {
        "type": "gaze",
        "action_id": self.action_id,
        "timestamp": time.time(),
        "payload": {"yaw": random.uniform(-20, 20), "pitch": random.uniform(-5, 5)}
      }
      await out_queue.put(event)

  async def _primary_behavior(self, out_queue: asyncio.Queue):
    """
    Placeholder: primary behavior could be TTS generation + playback or listening.
    For TTS: emit a 'speech_start' then produce audio; on completion, return.
    Here we simulate the primary lasting `duration` seconds.
    """
    duration = float(self.config.get("duration", 3.0))
    # announce start
    await out_queue.put({
      "type": "speech_start",
      "action_id": self.action_id,
      "timestamp": time.time(),
      "payload": {"text": self.config.get("text", "Hello")}
    })
    # Simulate doing TTS generation / playback (could be replaced with real TTS)
    try:
      await asyncio.sleep(duration)
    finally:
      await out_queue.put({
        "type": "speech_end",
        "action_id": self.action_id,
        "timestamp": time.time(),
        "payload": {}
     })