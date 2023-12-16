const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors');
app.use(express.json()); 
// Use CORS with default settings (allow requests from any origin)
app.use(cors());

// Middleware to set SSE headers
function setSSEHeaders(req, res, next) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin or specify your client's origin
    res.flushHeaders(); // flush the headers to establish SSE with the client
    next();
}
let clients = [];
// Route for chat endpoint
app.get('/health',(req,res)=>{
    res.status(200)
    res.send("health")
})

app.get('/chat', setSSEHeaders, (req, res) => {
    // Function to send a message

    clients.push(res);
    // const sendMessage = (message) => {
    //     res.write(`data: ${JSON.stringify(message)}\n\n`);
    // };

    // // Example: Sending a welcome message
    // sendMessage({ user: 'Server', text: `To create a chat interface similar to ChatGPT that renders messages word-by-word, you can modify your client-side code (in your React application) to handle this type of rendering. This requires a bit of additional logic to progressively display the message.

    // Here’s a way to implement this:` });

    // // You can integrate your chat logic here, e.g., listen to a chat service or database and send messages.

    // Handle client disconnect
    req.on('close', () => {
        console.log('Client disconnected');
        // Clean up resources or stop listening to chat service.
    });
});

// Function to send a message to all connected clients
function sendMessageToClients(message) {
    clients.forEach(client =>
        client.write(`data: ${JSON.stringify(message)}\n\n`)
    );
}

// Endpoint to receive messages from the client
app.post('/send-message', (req, res) => {
    const userMessage = req.body.message;
    
    // Here, you would typically include your AI chat logic or processing
    // For demonstration, let's just echo the message back
    const aiResponse = `Echo: ${userMessage}`;

    // Send the AI response to all connected clients
    sendMessageToClients({ user: 'AI', text: aiResponse });

    res.status(200).json({ message: "Message received" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
