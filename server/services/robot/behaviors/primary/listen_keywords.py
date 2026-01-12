import asyncio, vosk
from pathlib import Path
from functools import lru_cache
import json

from services.robot import Robot
from services.robot.behaviors.primary.base import PrimaryBehavior

SAMPLE_RATE = 16000
BYTES_PER_SAMPLE = 2  # 16-bit audio
FRAME_MS = 30
FRAME_BYTES = int(SAMPLE_RATE * (FRAME_MS / 1000) * BYTES_PER_SAMPLE)
MAX_TIMEOUT = 60 # time before quitting in seconds

# BASE_DIR = Path(__file__).resolve().parents[1]  # points to server/
# model_dir = BASE_DIR / ".vosk" / "vosk-model-small-en-us-0.15"

model_dir = Path(__file__).resolve().parents[4] / ".vosk" / "vosk-model-small-en-us-0.15"

# instantiate vosk model once per server instance
# multiple recognizers can work simultaneously with this model
@lru_cache()
def get_vosk_model():
  return vosk.Model(str(model_dir))

def preload_vosk_model():
  get_vosk_model()

class ListenKeywordPrimary(PrimaryBehavior):
  name = "listen_keyword"

  def __init__(self, keywords: list[str]):
    self.model = get_vosk_model()
    self.recognizer = vosk.KaldiRecognizer(self.model, SAMPLE_RATE)
    self.recognizer.SetWords(True)
    self.keywords = [k.lower() for k in keywords]
    self.buffer = bytearray()

  async def run(self, robot: Robot, output_queue: asyncio.Queue, stop_event: asyncio.Event):
    self._stop_event = stop_event
    transport, protocol = await robot.open_mic_stream(
      local_ip="0.0.0.0",
      receive_callback=self.process_keywords
    )
    loop = asyncio.get_running_loop()
    min_runtime = loop.time() + MAX_TIMEOUT
    try:
      while not self._stop_event.is_set() and loop.time() < min_runtime:
        await asyncio.sleep(FRAME_MS / 1000.0)
    finally:
      transport.close()

  def process_keywords(self, data: bytes, addr=None):
    self.buffer.extend(data)
    while len(self.buffer) >= FRAME_BYTES:
      frame = bytes(self.buffer[:FRAME_BYTES])
      del self.buffer[:FRAME_BYTES]

      if self.recognizer.AcceptWaveform(frame):
        result = json.loads(self.recognizer.Result())
        transcript = result.get("text", "").strip().lower()
        if any(k in transcript.split() for k in self.keywords):
          if self._stop_event and not self._stop_event.is_set():
            self._stop_event.set()
          print(f"Robot {addr}: keyword detected: {transcript}")