# this file exposes the generated OpenAPI server code as a Flask app
# that can be integrated with other Flask routes and middleware
#
# This is necessary because the OpenAPI spec only covers web client <-> server, and 
# we need additional (handcrafted) routes for robot <-> server communication.

import os
import json
import connexion
from generated.openapi_server import encoder
from connexion.jsonifier import Jsonifier
from connexion.apis.aiohttp_api import AioHttpApi

def create_connexion_app():
	app = connexion.AioHttpApp(
		__name__,
		specification_dir=os.path.join(
			os.path.dirname(__file__),
			"generated",
			"openapi_server",
			"openapi"
		),
	)
	AioHttpApi.jsonifier = Jsonifier(json, cls=encoder.ModelJSONEncoder)
	app.add_api("openapi.yaml", base_path='/api', pythonic_params=True, pass_context_arg_name="request")
	return app
