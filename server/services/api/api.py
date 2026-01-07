# web api for the client to interact with the server

from flask import Flask, jsonify, request
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.serving import run_simple

from openapi_adapter import create_connexion_app

def start():
  # app = Flask(__name__)
  # define_routes(app)
  
  openapi_app = create_connexion_app()
  # application = DispatcherMiddleware(app, {'/': openapi_app})
  
  # for development only
  run_simple("0.0.0.0", 12000, openapi_app, use_reloader=True, use_debugger=True)