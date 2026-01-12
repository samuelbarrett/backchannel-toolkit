# Backchanneling Toolkit

This is a toolkit for authoring robot backchanneling behaviors in a block-based programming manner.
This application is part of a master's thesis project on exposing rich dialog behaviors (backchanneling) to non-expert end users of robot behavior authoring tools.

## Components

This project consists of a user-facing web client, Python backend, and a thin client for a robot.

| Component | Description |
|---|---|
| Client | User-facing NodeJS web application featuring Google Blockly |
| Server | Stateful Python server and APIs for communicating between client and robot |
| Robot | Thin Java client run on a VStone Sota robot |

## Usage

### Running the code

Make sure to install Node modules and Python packages as required, in their respective directories (i.e., `client/` for Node, and `server/` for Python).

Run the following in separate terminals, and the Sota jar on the Sota robot.

| Component | Command | Description |
|---|---|---|
| Frontend UI | `npm start` | Serves frontend webpack bundle |
| NodeJS server | `npm run server` | Runs Node Express backend handling UI logic |
| Python backend | `python3 -m server` | Runs Python backend server |
| Sota client | `java -jar <nameofjar>.jar` | Runs Sota-side thin client |

**Ports**: audio is streamed from the robot to the server over UDP. The robot's outgoing port (for sending audio input data to the server) is unique to other robots based on its given ID, e.g., 7000 + robotId.

### Development

#### API
The API follows an OpenAPI Schema which was used to create classes and models for each endpoint in the backend, and corresponding typescript types in the client, all done using a rule-based generator `openapi-generator`.

The API documentation is generated HTML in `commmon/openapi-docs`. To view the API documentation, run `npm run docs` which will serve the docs as a locally-hosted webpage.