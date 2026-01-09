import asyncio
import random
from robot.behaviors.RobotEvent import RobotEvent

# Example behavior coroutines
async def utterance_behavior(event_queue):
    try:
        while True:
            await event_queue.put(RobotEvent(type='UTTERANCE', utterance="Hello, world!"))
            await asyncio.sleep(random.uniform(1, 3))
    except asyncio.CancelledError:
        pass