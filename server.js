const express = require('express');
const app = express();
const PORT = 8080;
const {chatWithOpenAI}=require('./openai')
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
app.post('/send-message', async (req, res) => {
    const userMessage = req.body.message;
    const result =  await chatWithOpenAI(userMessage)        
    // For demonstration, let's just echo the message back
    // const aiResponse = `Echo: ${userMessage}`;
    // Send the AI response to all connected clients
    sendMessageToClients({ user: 'AI', text: result });

    res.status(200).json({ message: "Message received" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
