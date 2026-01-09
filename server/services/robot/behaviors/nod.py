import asyncio
import random
from generated.openapi_server.models.behavior import Behavior

# Example behavior coroutines
async def nod_behavior(event_queue):
    try:
        while True:
            await event_queue.put(Behavior(type='NOD', amplitude=random.randint(1, 10), speed=random.randint(1, 5)))
            await asyncio.sleep(random.uniform(1, 3))
    except asyncio.CancelledError:
        pass