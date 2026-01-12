import json
from pathlib import Path
import vosk
import asyncio
from services.robot.Robot import Robot

BASE_DIR = Path(__file__).resolve().parents[1]  # points to server/
model_dir = BASE_DIR / ".vosk" / "vosk-model-small-en-us-0.15"

SAMPLE_RATE = 16000
BYTES_PER_SAMPLE = 2  # 16-bit audio
FRAME_MS = 30
FRAME_BYTES = int(SAMPLE_RATE * (FRAME_MS / 1000) * BYTES_PER_SAMPLE)

buffer = bytearray()
keywords = ["one", "two", "three", "four", "five"]
model = vosk.Model(str(model_dir))
recognizer = vosk.KaldiRecognizer(model, SAMPLE_RATE)

def process_audio(data: bytes, addr=None):
  buffer.extend(data)
  while len(buffer) >= FRAME_BYTES:
    frame = bytes(buffer[:FRAME_BYTES])
    del buffer[:FRAME_BYTES]

    if recognizer.AcceptWaveform(frame):
      result = json.loads(recognizer.Result())
      transcript = result.get("text", "").strip().lower()
      print("Result:", transcript)
      if any(k in transcript.split() for k in keywords):
        print(f"Keyword detected: {transcript}")
    else:
      partial_result = json.loads(recognizer.PartialResult())
      print("Partial Result:", partial_result)

async def main():
  recognizer.SetWords(True)
  robot: Robot = Robot(
    id=1,
    ip_address="10.151.63.77",
    voice_port=8888,
    microphone_port=7777,
  )
  transport, protocol = await robot.open_mic_stream(
    local_ip="10.152.181.123",
    receive_callback=process_audio,
  )
  try:
    await asyncio.sleep(20)
  finally:
    transport.close()

asyncio.run(main())