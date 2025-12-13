# handles audio streams with the robot

import asyncio

async def audio_stream(socket, mode, duration):
  """Handle audio streaming."""
  if mode == "send":
    print("Starting audio stream for", duration, "seconds.")
  elif mode == "receive":
    print("Receiving audio stream for", duration, "seconds.")
  await asyncio.sleep(duration)
  print("Audio stream ended.")