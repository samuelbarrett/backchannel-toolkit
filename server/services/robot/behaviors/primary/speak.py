import asyncio, io
from gtts import gTTS
from pydub import AudioSegment

from services.robot.Robot import _UDPStreamProtocol, Robot
from .base import PrimaryBehavior

CHUNK_SIZE = 4096
SAMPLE_RATE = 16000
CHANNELS = 1

class SpeakPrimary(PrimaryBehavior):
  name = "speak"

  def __init__(self, text: str):
    self.text = text

  # run the behavior
  async def run(self, robot: Robot, output_queue: asyncio.Queue, stop_event: asyncio.Event):
    wav_bytes = await self.synthesize_wav_bytes()
    await self.stream_to_robot(
      robot.ip_address,
      robot.voice_port,
      wav_bytes,
      chunk_size=CHUNK_SIZE
    )
    stop_event.set()
  
  # stream given bytes to the robot over UDP
  async def stream_to_robot(self, host: str, port: int, wav_bytes: bytes, chunk_size: int = 4096):
    loop = asyncio.get_running_loop()
    transport, protocol = await loop.create_datagram_endpoint(
      lambda: _UDPStreamProtocol(),
      remote_addr=(host, port)
    )
    try:
      for i in range(0, len(wav_bytes), chunk_size):
        chunk = wav_bytes[i: i + chunk_size]
        transport.sendto(chunk)
        await asyncio.sleep(0.0)
    finally:
      transport.close()
  
  # fetch generated TTS wav bytes
  async def synthesize_wav_bytes(self) -> bytes:
    def _blocking():
      # get TTS from gTTS
      mp3_buffer = io.BytesIO()
      tts = gTTS(text=self.text, lang='en').write_to_fp(mp3_buffer)
      mp3_buffer.seek(0)

      # downsample to play correctly on the robot
      audio_segment = AudioSegment.from_file(mp3_buffer, format="mp3")
      audio_16k_mono = audio_segment.set_frame_rate(SAMPLE_RATE).set_channels(CHANNELS)
      
      # convert to wav bytes
      wav_buf = io.BytesIO()
      audio_16k_mono.export(wav_buf, format="wav")
      return wav_buf.read()
    return await asyncio.to_thread(_blocking)
