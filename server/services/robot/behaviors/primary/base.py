from typing import Protocol, Any, TYPE_CHECKING
import asyncio

if TYPE_CHECKING:
    from services.robot.Robot import Robot

class PrimaryBehavior(Protocol):
    name: str
    async def run(
        self,
        robot: "Robot",
        cfg: dict[str, Any],
        output_q: asyncio.Queue,
        stop_event: asyncio.Event,
    ) -> None: ...

class PrimaryFactory:
    @staticmethod
    def build(kind: str, **kwargs) -> PrimaryBehavior:
        if kind == "speak":
            from .speak import SpeakPrimary
            return SpeakPrimary(**kwargs)
        if kind == "listen_until_silence":
            from .listen_vad import ListenUntilSilencePrimary
            return ListenUntilSilencePrimary(**kwargs)
        if kind == "listen_keyword":
            from .listen_keyword import ListenKeywordPrimary
            return ListenKeywordPrimary(**kwargs)
        raise ValueError(f"Unknown primary behavior {kind}")