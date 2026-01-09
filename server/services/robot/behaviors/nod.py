import asyncio
import random
from robot.behaviors.RobotEvent import RobotEvent

# Example behavior coroutines
async def nod_behavior(event_queue):
    try:
        while True:
            await event_queue.put(RobotEvent(type='NOD', amplitude=random.randint(1, 10), speed=random.randint(1, 5)))
            await asyncio.sleep(random.uniform(1, 3))
    except asyncio.CancelledError:
        pass