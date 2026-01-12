#!/usr/bin/env python3

# main file for the server application

from services.robot.behaviors.primary.listen_keywords import preload_vosk_model
import services.api.api as api

def main():
  initialize_server()

def initialize_server():
  print("Starting server...")
  preload_vosk_model() # preload local ASR model
  api.start()

if __name__ == "__main__":
  main()