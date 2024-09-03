# LLM Backend Proxy

## Purpose

This project provides a flexible and efficient Express.js backend that acts as a proxy for Large Language Model (LLM) API calls. It's designed to facilitate single or multiple LLM interactions while allowing for response improvements in multi-call scenarios.

## Features

- Supports single and multiple LLM API calls
- Configurable number of API calls per request
- Automatic response improvement for multi-call scenarios
- API key authentication
- Flexible LLM endpoint configuration
- Docker support for easy deployment

## How It Works

### Single Call Mode

When the number of calls is set to 1 (default), the backend acts as a simple proxy:

1. Receives the request from the client
2. Forwards the request to the specified LLM endpoint
3. Returns the LLM's response directly to the client

### Multiple Call Mode

When the number of calls is set to more than 1, the backend performs the following steps:

1. Makes the initial call to the LLM endpoint
2. For each subsequent call (up to the specified number):
   - Appends the previous LLM response to the message history
   - Adds a prompt asking the LLM to review and improve its response
   - Makes another call to the LLM endpoint with the updated message history
3. Returns the final LLM response to the client

## Setup and Usage

### Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)
- Docker (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd llm-backend-proxy
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Server

1. Start the server:
   ```
   node server.js
   ```
   The server will start on port 3000 by default.

### Making Requests

Send POST requests to `http://localhost:3000/execute` with the following:

- Headers:
  - `x-llm-endpoint`: The URL of the LLM API endpoint
  - `x-llm-apikey`: Your API key for the LLM service
  - `x-llm-num-calls`: (Optional) Number of LLM calls to make (default is 1)

- Body (JSON):
  ```json
  {
    "model": "your-model-name",
    "messages": [
      {"role": "system", "content": "Your system message"},
      {"role": "user", "content": "Your user message"}
    ]
  }
  ```

### Docker Deployment

1. Build the Docker image:
   ```
   docker build -t llm-backend .
   ```

2. Run the Docker container:
   ```
   docker run -p 3000:3000 -d llm-backend
   ```

## Configuration

- The server port can be configured by setting the `PORT` environment variable.
- LLM endpoint, API key, and number of calls are configured per-request via headers.

## Error Handling

The server will return appropriate error messages for missing headers or failed API calls.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Specify your license here]