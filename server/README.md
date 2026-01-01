## Generated code

Anything in the `server/generated` folder is considered throwaway code and should not be edited, beyond calling backend services from the controller.

This generates stubbed server-side code conforms to the API specification laid out in `../common/openapi.yaml`, to which this Python server and the NodeJS client conform.

It was generated with the OpenAPI generator CLI, using the following command:

`openapi-generator generate -i ../common/openapi.yaml -g python-flask -o ./generated`

### Usage
The generated server must be installed as a package to be imported and invoked in the main server code, using e.g., `pip install -e ./generated` if run from the `server/` directory.
