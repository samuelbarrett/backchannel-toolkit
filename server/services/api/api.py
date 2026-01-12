# web api for the client to interact with the server
from pathlib import Path

from openapi_adapter import create_connexion_app

def start():
  openapi_app = create_connexion_app()
  
  # for development only
  openapi_app.run(host="0.0.0.0",port=12000)