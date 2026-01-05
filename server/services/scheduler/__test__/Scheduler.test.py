from services.scheduler import Scheduler
from services.scheduler import ActionController
from services.robot.RobotAction import RobotAction
import asyncio

# this test isn't using a formal test framework, just a simple demo of the system
async def test():
  robot_url = "http://127.0.0.1:8001/robot_command"  # change to your robot endpoint
  scheduler = Scheduler.Scheduler(robot_url)
  await scheduler.start()

  controller = ActionController.ActionController(scheduler)
  await controller.start()

  # Example: enqueue two actions quickly; they will run sequentially
  a1 = RobotAction("action1", {"nod": {"enabled": True, "freq": 0.8}, "gaze": {"enabled": True, "freq": 0.3}, "duration": 4.0, "text": "Hi there"})
  a2 = RobotAction("action2", {"nod": {"enabled": True, "freq": 0.4}, "gaze": {"enabled": False}, "duration": 2.5, "text": "Follow up"})

  await controller.enqueue(a1)
  await controller.enqueue(a2)

  # Let the demo run until both actions are processed
  await controller.action_queue.join()
  # Wait for scheduler queue to be flushed
  await scheduler.queue.join()

  # cleanup
  await controller.stop()
  await scheduler.stop()

if __name__ == "__main__":
  asyncio.run(test())