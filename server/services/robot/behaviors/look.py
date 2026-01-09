import asyncio
import random
from robot.behaviors.RobotEvent import RobotEvent

# example behavior coroutines
async def look_around_behavior(event_queue):
    try:
        while True:
            await event_queue.put(RobotEvent(type='LOOK', amplitude=random.randint(1, 10), speed=random.randint(1, 5)))
            await asyncio.sleep(random.uniform(2, 4))
    except asyncio.CancelledError:
        pass