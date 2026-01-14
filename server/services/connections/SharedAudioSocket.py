from __future__ import annotations
import asyncio
from collections import defaultdict
from typing import Callable, DefaultDict, List, List, Tuple

AudioCallback = Callable[[bytes, Tuple[str, int]], None]

class StreamSubscription:
  def __init__(self, demux: SharedAudioSocket, source_ip: str, playback_addr: Tuple[str, int], callback: AudioCallback | None):
    self._demux = demux
    self._source_ip = source_ip
    self._playback_addr = playback_addr
    self._callback = callback
    self._closed = False

  def handle(self, data: bytes, addr: Tuple[str, int]):
    if self._callback:
      self._callback(data, addr)

  def send(self, data: bytes):
    if self._closed:
      raise RuntimeError("Cannot send on closed StreamSubscription")
    self._demux.sendto(data, self._playback_addr)
  
  def close(self):
    if not self._closed:
      self._demux._unsubscribe(self._source_ip, self)
      self._closed = True


class SharedAudioSocket(asyncio.DatagramProtocol):
  _instance: SharedAudioSocket | None = None
  _instance_lock: asyncio.Lock | None = None
  _listen_addr: Tuple[str, int] | None = None

  def __init__(self):
    self._transport: asyncio.DatagramTransport | None = None
    self._routes: DefaultDict[str, List[StreamSubscription]] = defaultdict(list)

  @classmethod
  async def get_or_create(cls, ip: str, port: int) -> SharedAudioSocket:
    if cls._instance and cls._listen_addr != (ip, port):
      raise RuntimeError(f"SharedAudioSocket already created with different address {cls._listen_addr}")
    if cls._instance is None:
      if cls._instance_lock is None:
        cls._instance_lock = asyncio.Lock()
      async with cls._instance_lock:
        if cls._instance is None:
          protocol = cls()
          loop = asyncio.get_running_loop()
          transport, _ = await loop.create_datagram_endpoint(
            lambda: protocol,
            local_addr=(ip, port)
          )
          protocol._transport = transport
          cls._listen_addr = (ip, port)
          cls._instance = protocol
    return cls._instance
  
  def register(self, robot_id: int, source_ip: str, playback_port: int, callback: AudioCallback | None) -> StreamSubscription:
    subscription = StreamSubscription(self, source_ip, (source_ip, playback_port), callback)
    self._routes[source_ip].append(subscription)
    return subscription
  
  def sendto(self, data: bytes, remote_addr: Tuple[str, int]):
    if not self._transport:
      raise RuntimeError("SharedAudioSocket transport not initialized")
    self._transport.sendto(data, remote_addr)
  
  def datagram_received(self, data, addr):
    source_ip, _ = addr
    for subscription in self._routes.get(source_ip, []):
      subscription.handle(data, addr)
  
  def _unsubscribe(self, source_ip: str, subscription: StreamSubscription):
    listeners = self._routes.get(source_ip)
    if not listeners:
      return
    try:
      listeners.remove(subscription)
    finally:
      if not listeners:
        del self._routes[source_ip]
