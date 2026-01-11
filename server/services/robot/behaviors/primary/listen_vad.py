from services.robot import Robot
from services.robot.behaviors.primary.base import PrimaryBehavior
import asyncio, struct, webrtcvad

class ListenUntilSilencePrimary(PrimaryBehavior):
    name = "listen_until_silence"

    def __init__(self, frame_ms=30, silence_ms=1200, cfg: dict = {}):
        self.frame_ms = frame_ms
        self.silence_ms = silence_ms
        self.vad = webrtcvad.Vad(2)
        self.cfg = cfg

    async def run(self, robot: Robot, output_q: asyncio.Queue, stop_event: asyncio.Event):
        reader = await robot.open_mic_stream()
        silence_budget = self.silence_ms
        # await output_q.put({"type": "listen_start", "action_id": cfg["action_id"]})
        while not stop_event.is_set():
            chunk = await reader.readexactly(self._frame_bytes(self.cfg))
            is_speech = self.vad.is_speech(chunk, self.cfg["sample_rate"])
            if is_speech:
                silence_budget = self.silence_ms
                print(f"[ListenUntilSilencePrimary][Robot {robot.id}] detected speech")
            else:
                silence_budget -= self.frame_ms
                if silence_budget <= 0:
                    break
        # await output_q.put({"type": "listen_end", "action_id": cfg["action_id"]})
        stop_event.set()

    def _frame_bytes(self) -> int:
        """Compute byte length for a single VAD frame."""
        sample_rate = int(self.cfg.get("sample_rate", 16000))
        sample_width = int(self.cfg.get("sample_width", 2))  # bytes per sample (16-bit default)
        channels = int(self.cfg.get("channels", 1))
        frame_samples = int(sample_rate * (self.frame_ms / 1000.0))
        return frame_samples * sample_width * channels