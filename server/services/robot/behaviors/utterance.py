import asyncio
import random
from generated.openapi_server.models.behavior import Behavior

# Example behavior coroutines
async def utterance_behavior(event_queue):
    try:
        while True:
            await event_queue.put(Behavior(type='UTTERANCE', utterance="Hello, world!"))
            await asyncio.sleep(random.uniform(1, 3))
    except asyncio.CancelledError:
        pass