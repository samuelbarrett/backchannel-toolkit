# defines a robot task which contains a primary coroutine and associated optional coroutines for other behaviors.
# The primary coroutine could be an audio stream, while the other behaviors are scheduled to run in parallel during the primary task.

from dataclasses import dataclass

@dataclass
class RobotTask:
    primary_coro: callable  # The main coroutine function to run (e.g., audio stream)
    behavior_coros: list    # List of additional behavior coroutine functions to run in parallel