import json
from openapi_server.models.base_model import Model

class ModelJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Model):
            return o.to_dict()
        return super().default(o)