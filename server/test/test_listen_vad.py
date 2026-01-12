import asyncio
from collections import deque
from services.robot.behaviors.primary.listen_vad import ListenUntilSilencePrimary
from services.robot.Robot import _UDPStreamProtocol, Robot
import sounddevice as sd

import webrtcvad

SAMPLE_RATE = 16000
FRAME_MS = 30
WINDOW_SIZE = 13
WINDOW_MS = FRAME_MS * WINDOW_SIZE
FRAME_BYTES = int(SAMPLE_RATE * (FRAME_MS / 1000) * 2)
vad = webrtcvad.Vad(2)

input_buffer = bytearray()

speech_votes = deque(maxlen=WINDOW_SIZE)
is_speaking = False
SPEECH_THRESHOLD = 0.8
SILENCE_THRESHOLD = 0.2

def process_audio(input_data, addr=None):
  global is_speaking
  input_buffer.extend(input_data)
  while len(input_buffer) >= FRAME_BYTES:
    frame = input_buffer[:FRAME_BYTES]
    del input_buffer[:FRAME_BYTES]
    try:
      is_speech = vad.is_speech(frame, SAMPLE_RATE)
      # print("Speech detected" if is_speech else "Silence")
    except Exception as e:
      print(f"Error processing frame: {e}")
      break
    speech_votes.append(is_speech)
    speech_ratio = sum(speech_votes) / len(speech_votes)
    if not is_speaking and speech_ratio > SPEECH_THRESHOLD:
      is_speaking = True
      print(">>> Speech started")
    elif is_speaking and speech_ratio < SILENCE_THRESHOLD:
      is_speaking = False
      print(">>> Speech ended")


def test_local_input():
  print("listening to speech on device input for 10 seconds...")
  with sd.RawInputStream(
    samplerate=SAMPLE_RATE,
    blocksize=int(SAMPLE_RATE * FRAME_MS / 1000 * 2),
    dtype='int16',
    channels=1,
    callback=process_audio
  ):
    sd.sleep(10000)
  
async def test_robot_udp_stream_input():
  robot: Robot = Robot(
    id=1,
    ip_address="10.0.0.178",
    voice_port=8888,
    microphone_port=7777
  )
  transport, protocol = await robot.open_mic_stream("0.0.0.0", receive_callback=process_audio)
  try:
    await asyncio.sleep(1000)
  finally:
    transport.close()

async def main():
  # test_local_input()
  await test_robot_udp_stream_input()

asyncio.run(main())