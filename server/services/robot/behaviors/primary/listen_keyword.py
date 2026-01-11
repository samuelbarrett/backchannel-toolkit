import asyncio, vosk
import json

from server.services.robot import Robot
from services.robot.behaviors.primary.base import PrimaryBehavior

class ListenKeywordPrimary(PrimaryBehavior):
    name = "listen_keyword"

    def __init__(self, model_path: str, keywords: list[str]):
        self.recognizer = vosk.KaldiRecognizer(vosk.Model(model_path), 16000)
        self.recognizer.SetWords(True)
        self.keywords = [k.lower() for k in keywords]

    async def run(self, robot: Robot, output_queue: asyncio.Queue, stop_event: asyncio.Event):
        reader = await robot.open_mic_stream()
        # await output_q.put({"type": "keyword_listen_start", "action_id": cfg["action_id"]})
        print(f"[ListenKeywordPrimary][Robot {robot.id}] listening for keywords: {self.keywords}")
        while not stop_event.is_set():
            chunk = await reader.read(4000)
            if not chunk:
                break
            if self.recognizer.AcceptWaveform(chunk):
                result = json.loads(self.recognizer.Result())
                transcript = result.get("text", "").lower()
                if any(k in transcript for k in self.keywords):
                    # await output_q.put({"type": "keyword_detected", "keyword": transcript})
                    print(f"[ListenKeywordPrimary][Robot {robot.id}] detected keyword: {transcript}")
                    break
        # await output_q.put({"type": "keyword_listen_end", "action_id": cfg["action_id"]})
        print(f"[ListenKeywordPrimary][Robot {robot.id}] stopping keyword listen")
        stop_event.set()