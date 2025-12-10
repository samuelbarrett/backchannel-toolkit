# web api for the client to interact with the server

from flask import Flask, jsonify, request

def start():
  app = Flask(__name__)
  define_routes(app)
  app.run(debug=True)

def define_routes(app):
  # get the status of the server in the form of its current state
  @app.route('/status', methods=['GET'])
  def status():
      return jsonify({"status": "Server is running"}), 200

  @app.route('/command', methods=['POST'])
  def command():
      content = request.json
      return jsonify({"received_command": content}), 200

if __name__ == "__main__":
    start()