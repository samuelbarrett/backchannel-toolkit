# this file exposes the generated OpenAPI server code as a Flask app
# that can be integrated with other Flask routes and middleware
#
# This is necessary because the OpenAPI spec only covers web client <-> server, and 
# we need additional (handcrafted) routes for robot <-> server communication.

import os
import connexion
from generated.openapi_server import encoder

def create_connexion_app():
	app = connexion.App(
		__name__,
		specification_dir=os.path.join(
			os.path.dirname(__file__),
			"generated",
			"openapi_server",
		),
	)
	app.app.json_encoder = encoder.JSONEncoder
	app.add_api("openapi/openapi.yaml", pythonic_params=True)
	return app.app
