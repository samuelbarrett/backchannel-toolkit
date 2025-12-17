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

This is a stub. Eventually, I'll have a nifty tool to spin everything up at once... right?

### Development

#### API
The API follows an OpenAPI Schema which was used to create classes and models for each endpoint in the backend, and corresponding typescript types in the client, all done using a rule-based generator `openapi-generator`.

The API documentation is generated HTML in `commmon/openapi-docs`. To view the API documentation, run `npm docs` which will serve the docs as a locally-hosted webpage.