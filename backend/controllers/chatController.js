const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });

const handleChat = async (req, res) => {
    try {
        const { message } = req.body; // user message
        
        // Send the User's Message to the OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message}]
        });
        
        // Get the reply and send it to the frontend
        const reply = response.data.choices[0].message.content;
        res.json({ reply }); 
    } catch (error) {
        console.error("Error with OpenAI API", error.message);
        res.status(500).json({ error: 'Something went wrong with the chatbot assistant.'});
    }
};

module.exports = { handleChat };