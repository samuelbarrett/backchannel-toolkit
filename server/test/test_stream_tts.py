import asyncio, io
import sys
from gtts import gTTS
from pydub import AudioSegment
from pydub.playback import play

from services.robot.Robot import _UDPStreamProtocol

async def synthesize_wav_bytes(text: str) -> bytes:
  def _blocking():
    # get TTS from gTTS
    mp3_buffer = io.BytesIO()
    tts = gTTS(text=text, lang='en').write_to_fp(mp3_buffer)
    mp3_buffer.seek(0)

    # downsample to play correctly on the robot
    audio_segment = AudioSegment.from_file(mp3_buffer, format="mp3")
    audio_16k_mono = audio_segment.set_frame_rate(16000).set_channels(1)
    
    # convert to wav bytes
    wav_buf = io.BytesIO()
    audio_16k_mono.export(wav_buf, format="wav")
    return wav_buf.read()
  return await asyncio.to_thread(_blocking)

async def stream_to_robot(host: str, port: int, wav_bytes: bytes, chunk_size: int = 2048):
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

async def output_to_speakers(wav_bytes: bytes):
  import sounddevice as sd
  import wave

  with wave.open(io.BytesIO(wav_bytes), "rb") as wav_read_object:
    nchannels=wav_read_object.getnchannels()
    sampwidth=wav_read_object.getsampwidth()
    framerate=wav_read_object.getframerate()
    nframes=wav_read_object.getnframes()
    raw_data = wav_read_object.readframes(nframes)

    audio_segment = AudioSegment(
      data=raw_data,
      sample_width=sampwidth,
      frame_rate=framerate,
      channels=nchannels,
    )

    play(audio_segment)

async def main():
  text = "Hello, this is a test of the text to speech streaming system."
  wav_bytes = await synthesize_wav_bytes(text)
  ip = str(sys.argv[1])
  await stream_to_robot(ip, 8888, wav_bytes, chunk_size=4096)
  # await output_to_speakers(wav_bytes)

asyncio.run(main())