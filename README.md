# Chat App with Server-Sent Events (SSE)

This chat application utilizes Server-Sent Events (SSE) to enable real-time communication between the server and clients. It's built with Node.js and can be containerized using Docker.
The project is deployed to AWS ECS through Terraform and Github action. 

## Getting Started

### Prerequisites

- Node.js
- Docker (optional)

### Installation

1. Clone the repository or download the source code.
2. Install the dependencies:
   ```
   npm install
   ```
3. Configure the application by setting up the necessary environment variables in the `.env` file.

### Running the Application

- To run the app locally:
  ```
  npm run dev
  ```
- To run the app using Docker:
  ```
  docker build -t chat-app-sse .
  docker run -p 80:80 chat-app-sse
  ```

## Features

- Real-time communication using SSE.
- [Additional features to be listed based on the content of `server.js` and other files.]

## Contributing

Feel free to fork the repository and submit pull requests.
