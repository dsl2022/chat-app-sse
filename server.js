const express = require('express');
const app = express();
const PORT = 3000;
const cors = require('cors');

// Use CORS with default settings (allow requests from any origin)
app.use(cors());

// Or, to be more specific, you can configure CORS to only accept requests from your React app's origin
app.use(cors({ origin: 'http://localhost:3001' }));


// Middleware to set SSE headers
function setSSEHeaders(req, res, next) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin or specify your client's origin
    res.flushHeaders(); // flush the headers to establish SSE with the client
    next();
}

// Route for chat endpoint
app.get('/chat', setSSEHeaders, (req, res) => {
    // Function to send a message
    const sendMessage = (message) => {
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    };

    // Example: Sending a welcome message
    sendMessage({ user: 'Server', text: `To create a chat interface similar to ChatGPT that renders messages word-by-word, you can modify your client-side code (in your React application) to handle this type of rendering. This requires a bit of additional logic to progressively display the message.

    Here’s a way to implement this:` });

    // You can integrate your chat logic here, e.g., listen to a chat service or database and send messages.

    // Handle client disconnect
    req.on('close', () => {
        console.log('Client disconnected');
        // Clean up resources or stop listening to chat service.
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
