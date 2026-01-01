#!/usr/bin/env python3

# main file for the server application

import services.api.api as api

def main():
  initialize_server()

def initialize_server():
  print("Starting server...")
  api.start()

if __name__ == "__main__":
  main()