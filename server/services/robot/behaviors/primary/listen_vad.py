from collections import deque
from services.robot import Robot
from services.robot.behaviors.primary.base import PrimaryBehavior
import asyncio, struct, webrtcvad

SAMPLE_RATE = 16000
FRAME_MS = 30
WINDOW_SIZE = 13
WINDOW_MS = FRAME_MS * WINDOW_SIZE
FRAME_BYTES = int(SAMPLE_RATE * (FRAME_MS / 1000) * 2)

SPEECH_THRESHOLD = 0.8
SILENCE_THRESHOLD = 0.2
                  
class ListenUntilSilencePrimary(PrimaryBehavior):
  name = "listen_until_silence"

  def __init__(self, start_delay_ms=5000, cfg: dict = {}):
    self.start_delay_ms = start_delay_ms
    self.vad = webrtcvad.Vad(2)
    self.speech_votes = deque(maxlen=WINDOW_SIZE)
    self.input_buffer = bytearray()
    self.is_speaking = False

  async def run(self, robot: Robot, output_queue: asyncio.Queue, stop_event: asyncio.Event):
    transport, protocol = await robot.open_mic_stream(
      local_ip="0.0.0.0",
      receive_callback=self.process_audio
    )
    loop = asyncio.get_running_loop()
    min_runtime = loop.time() + self.start_delay_ms / 1000.0
    try:
      while loop.time() < min_runtime:
        await asyncio.sleep(FRAME_MS / 1000.0)
    finally:
      transport.close()
    stop_event.set()

  def process_audio(self, input_data, addr=None):
    self.input_buffer.extend(input_data)
    while len(self.input_buffer) >= FRAME_BYTES:
      frame = self.input_buffer[:FRAME_BYTES]
      del self.input_buffer[:FRAME_BYTES]
      try:
        is_speech = self.vad.is_speech(frame, SAMPLE_RATE)
        # print("Speech detected" if is_speech else "Silence")
      except Exception as e:
        print(f"Error processing frame: {e}")
        break

      # update speech votes and speaking state
      self.speech_votes.append(is_speech)
      speech_ratio = sum(self.speech_votes) / len(self.speech_votes)
      if not self.is_speaking and speech_ratio > SPEECH_THRESHOLD:
        self.is_speaking = True
        print(">>> Speech started")
      elif self.is_speaking and speech_ratio < SILENCE_THRESHOLD:
        self.is_speaking = False
        print(">>> Speech ended")