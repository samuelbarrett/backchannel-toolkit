import asyncio
import pytest
import socket

from scheduler.BehaviorScheduler import BehaviorScheduler
from robot.Robot import Robot
from robot.behaviors.RobotEvent import RobotEvent
from robot.behaviors.RobotTask import RobotTask
from robot.behaviors.nod import nod_behavior
from robot.behaviors.look import look_around_behavior
from robot.audio_stream import audio_stream

@pytest.mark.asyncio
async def test_scheduler_runs_and_stops_behaviors():
    class TestRobot(Robot):
        def __init__(self):
            self.commands = []
        async def send_command(self, command, **params):
            self.commands.append((command, params))

    robot = TestRobot()
    scheduler = BehaviorScheduler(robot)

    task = RobotTask(
        primary_coro=audio_stream(socket, "send", duration=1),
        behavior_coros=[nod_behavior, look_around_behavior]
    )

    # Run scheduler with short audio and two behaviors
    await scheduler.run_task(task)

    # Check that some commands were sent
    assert any(cmd[0] == 'nod' for cmd in robot.commands)
    assert any(cmd[0] == 'look_around' for cmd in robot.commands)

@pytest.mark.asyncio
async def test_scheduler_stops_behaviors_on_audio_end():
    class TestRobot(Robot):
        def __init__(self):
            self.commands = []
        async def send_command(self, command, **params):
            self.commands.append((command, params))

    robot = TestRobot()
    scheduler = BehaviorScheduler(robot)

    task = RobotTask(
        primary_coro=audio_stream(socket, "send", duration=1),
        behavior_coros=[nod_behavior, look_around_behavior]
    )

    # Run scheduler with short audio and two behaviors
    await scheduler.run_task(task)

    # Wait a bit to ensure behaviors have stopped
    await asyncio.sleep(0.2)
    count_after = len(robot.commands)
    await asyncio.sleep(0.5)
    # No new commands should be sent after behaviors stopped
    assert len(robot.commands) == count_after

@pytest.mark.asyncio
async def test_event_dispatcher_handles_multiple_events():
    class TestRobot(Robot):
        def __init__(self):
            self.commands = []
        async def send_command(self, command, **params):
            self.commands.append((command, params))

    robot = TestRobot()
    scheduler = BehaviorScheduler(robot)
    await scheduler.start_dispatcher()
    # Put multiple events
    await scheduler.event_queue.put(RobotEvent(type='nod', params={'speed': 1}))
    await scheduler.event_queue.put(RobotEvent(type='look_around', params={'angle': 30}))
    await asyncio.sleep(0.1)
    # Check that both commands were sent
    assert ('nod', {'speed': 1}) in robot.commands
    assert ('look_around', {'angle': 30}) in robot.commands