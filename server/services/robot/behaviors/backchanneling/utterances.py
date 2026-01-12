from typing import TYPE_CHECKING
from generated.openapi_server.models.style import Style
import asyncio, io
import random
from gtts import gTTS
from pydub import AudioSegment

if TYPE_CHECKING:
  from services.robot.Robot import _UDPStreamProtocol, Robot

CHUNK_SIZE = 4096
SAMPLE_RATE = 16000
CHANNELS = 1

MAX_INTERVAL = 15.0
MIN_INTERVAL = 3.0

async def emit_utterances(robot: "Robot", style: Style, stop_event: asyncio.Event):
  utterances = style.utterances.utterance_list if style.utterances.utterance_list else ["hmm", "mhm", "uh-huh", "yeah", "right", "oh"]
  
  loop = asyncio.get_running_loop()
  transport, protocol = await robot.open_voice_stream()
  try:
    while not stop_event.is_set():
      utterance = random.choice(utterances)
      wav_bytes = await synthesize_wav_bytes(utterance)
      for i in range(0, len(wav_bytes), CHUNK_SIZE):
        chunk = wav_bytes[i: i + CHUNK_SIZE]
        transport.sendto(chunk)
        await asyncio.sleep(0.0)
      # wait before next utterance based on style settings
      wait_time = await _next_wait_time(style.utterances.utterance_frequency)
      await asyncio.sleep(wait_time)
  finally:
    transport.close()

# fetch generated TTS wav bytes
async def synthesize_wav_bytes(utterance) -> bytes:
  def _blocking():
    # get TTS from gTTS
    mp3_buffer = io.BytesIO()
    tts = gTTS(text=utterance, lang='en').write_to_fp(mp3_buffer)
    mp3_buffer.seek(0)

    # downsample to play correctly on the robot
    audio_segment = AudioSegment.from_file(mp3_buffer, format="mp3")
    audio_16k_mono = audio_segment.set_frame_rate(SAMPLE_RATE).set_channels(CHANNELS)
    
    # convert to wav bytes
    wav_buf = io.BytesIO()
    audio_16k_mono.export(wav_buf, format="wav")
    return wav_buf.read()
  return await asyncio.to_thread(_blocking)

async def _next_wait_time(frequency: int):
  freq = max(0, min(100.0, frequency)) / 100.0  # clamp to [0,100] and scale to [0,1]
  interval_span = MAX_INTERVAL - MIN_INTERVAL
  mode = MAX_INTERVAL - (freq * interval_span)
  return random.triangular(MIN_INTERVAL, MAX_INTERVAL, mode)