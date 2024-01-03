const express = require('express');
const app = express();
const PORT = 8080;
const dotenv = require('dotenv');
dotenv.config()
const cors = require('cors');
const {OPENAI_API_KEY} = JSON.parse(process.env.OPENAI_API_KEY)
const {EndPoint} = require('llm-api-endpoints-agents')
const {makeRequest} = require("./utils/apiService")
const ep = new EndPoint("gpt-4",OPENAI_API_KEY)
app.use(express.json()); 
const {API_ENDPOINTS_CONFIG_PATH} = JSON.parse(process.env.API_ENDPOINTS_CONFIG_PATH)
console.log(typeof API_ENDPOINTS_CONFIG_PATH)
console.log("test API_ENDPOINTS_CONFIG_PATH", API_ENDPOINTS_CONFIG_PATH)
// Use CORS with default settings (allow requests from any origin)
const allowedOrigins = ['http://localhost:3000', 'http://d2f0d82fydy0jb.cloudfront.net'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors());
console.log("app ran")
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
    console.log("ran health")
    res.status(200)
    res.send("health")
})

app.get('/chat', setSSEHeaders, (req, res) => {
    // Function to send a message
    console.log("chat ran")
    console.log("res test",res)
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
    const result =  await ep.selectEndpoint(userMessage,API_ENDPOINTS_CONFIG_PATH)
    if (result && result.choices && result.choices.length > 0) {
        console.log(result.choices[0].message.content);
        const endpointDetails = JSON.parse(result.choices[0].message.content);
        if(endpointDetails?.error){
            sendMessageToClients({ user: 'AI', text: JSON.stringify(endpointDetails) });
            return res.status(200).json({ message: "Message received" });
        }
        if (endpointDetails) {
            const { endpoint, method } = endpointDetails;            
            const data = await makeRequest(endpoint, method)  

            sendMessageToClients({ user: 'AI', text: JSON.stringify({data,endpoint,method}) });
        }
    }
    res.status(200).json({ message: "Message received" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
