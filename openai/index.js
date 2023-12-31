const dotenv = require('dotenv')
dotenv.config()
const openai_api_key = process.env.OPENAI_API_KEY
const axios = require('axios');
const endpoint = 'https://api.openai.com/v1/chat/completions';

async function chatWithOpenAI(message) {
    try {
        const response = await axios.post(endpoint, {
            model: 'gpt-4', // Or use another model
            messages: [{role: "user", content: message}]
        }, {
            headers: {
                'Authorization': `Bearer ${openai_api_key}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error communicating with OpenAI:', error);
        return null;
    }
}

module.exports = {chatWithOpenAI}