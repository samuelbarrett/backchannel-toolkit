from __future__ import annotations
import asyncio
import random
import time
from typing import Any, Dict, TYPE_CHECKING

from generated.openapi_server.models.behavior import Behavior
from generated.openapi_server.models.style import Style
from services.robot.behaviors.backchanneling.utterances import emit_utterances
from services.robot.behaviors.primary.base import PrimaryBehavior

if TYPE_CHECKING:
  from services.robot.Robot import Robot

"""
RobotAction represents a single primary action of generated behaviors. It manages multiple sub-behaviors (like nodding, gazing)
that run concurrently while a primary behavior (like TTS playback or listening) is active.
"""
class RobotAction:
  def __init__(self, primary_behavior: PrimaryBehavior, robot: "Robot", style: Style):
    self.primary_behavior: PrimaryBehavior = primary_behavior
    self.robot: Robot = robot
    self.style: Style = style
    self._stop_event = asyncio.Event()
    self._tasks: list[asyncio.Task] = []

  async def run(self, output_queue: asyncio.Queue):
    """
    Run this action and its behaviors: spawn sub-behaviors, run primary, then stop subs cleanly.
    """
    # spawn sub-behaviors
    if self.style:
      nodding = getattr(self.style, 'nodding', None)
      gaze = getattr(self.style, 'gaze', None)
      utterances = getattr(self.style, 'utterances', None)
      if nodding and getattr(nodding, 'enabled', False):
        t = asyncio.create_task(self._nodder(output_queue))
        self._tasks.append(t)
      if gaze and getattr(gaze, 'enabled', False):
        t = asyncio.create_task(self._gazer(output_queue))
        self._tasks.append(t)
      if utterances and getattr(utterances, 'enabled', False):
        t = asyncio.create_task(emit_utterances(
          robot=self.robot,
          style=self.style,
          stop_event=self._stop_event,
        ))
        self._tasks.append(t)

    try:
      await self.primary_behavior.run(
        robot=self.robot,
        output_queue=output_queue,
        stop_event=self._stop_event,
      )
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
    """Emit head-nod events."""
    nodding = getattr(self.style, 'nodding', None)
    if nodding:
      freq = float(getattr(nodding, 'frequency', 0))  # nods per sec
      if freq <= 0:
        return
      base_interval = 1.0 / freq
      while not self._stop_event.is_set():
        # add jitter
        interval = max(0.05, random.gauss(base_interval, base_interval * 0.2))
        await asyncio.sleep(interval)
        if self._stop_event.is_set():
          break
        event: Behavior = Behavior(
          type="nod",
          amplitude=random.randint(1, 10),
          speed=random.randint(1, 5),
        )
        await out_queue.put(event)

  async def _gazer(self, out_queue: asyncio.Queue):
    """Emit gaze shift events."""
    gaze = getattr(self.style, 'gaze', None)
    if gaze:
      freq = float(getattr(gaze, 'shift_gaze', 0))
      if freq <= 0:
        return
      base_interval = 1.0 / freq
      while not self._stop_event.is_set():
        interval = max(0.05, random.gauss(base_interval, base_interval * 0.3))
        await asyncio.sleep(interval)
        if self._stop_event.is_set():
          break
        event: Behavior = Behavior(
          type="look",
          amplitude=0,  # not used for gaze
          speed=0,      # not used for gaze
        )
        await out_queue.put(event)
  
  async def _utterances(self, out_queue: asyncio.Queue):
    """Emit small utterance events (e.g., 'uh-huh', 'mm-hmm')."""
    
    utterances = getattr(self.style, 'utterances', None)
    if utterances:
      freq = float(getattr(utterances, 'utterance_frequency', 0))
      if freq <= 0:
        return
      base_interval = 1.0 / freq
      utterances_list: list[str] = ["uh-huh", "mm-hmm", "yeah", "right", "I see"]
      while not self._stop_event.is_set():
        interval = max(0.05, random.gauss(base_interval, base_interval * 0.4))
        await asyncio.sleep(interval)
        if self._stop_event.is_set():
          break
        utterance: str = random.choice(utterances)
        event: Behavior = Behavior(
          type="utterance",
          utterance=utterance,
        )
        await out_queue.put(event)