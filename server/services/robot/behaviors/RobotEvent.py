# defines a robot behavior event handled by the BehaviorScheduler

from dataclasses import dataclass

@dataclass
class RobotEvent:
  type: str # either "NOD", "UTTERANCE", or "LOOK"
  amplitude: int = 0
  speed: int = 0
  utterance: str = ""