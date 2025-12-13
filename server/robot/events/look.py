import asyncio
import random
from server.robot.events.RobotEvent import RobotEvent

# example behavior coroutines
async def look_around_behavior(event_queue):
    try:
        while True:
            await event_queue.put(RobotEvent(type='look_around', params={}))
            await asyncio.sleep(random.uniform(2, 4))
    except asyncio.CancelledError:
        pass