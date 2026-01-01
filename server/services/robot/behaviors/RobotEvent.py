# defines a robot behavior event handled by the BehaviorScheduler

from dataclasses import dataclass

@dataclass
class RobotEvent:
    type: str
    params: dict