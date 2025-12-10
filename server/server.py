# main file for the server application

import api

def main():
  initialize_server()

def initialize_server():
  print("Starting server...")
  api.start()

if __name__ == "__main__":
  main()