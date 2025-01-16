const OpenAI = require('openai');
const dotenv = require('dotenv');
const Fuse = require('fuse.js');
const dataset = require('../datasets/aboutme.json');

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });

const fuse = new Fuse(dataset, {
    keys: ['question', 'relatedQuestions'], 
    threshold: 0.4, 
    includeScore: true,
    });

// Find the best match
const findAnswer = (message) => {
    const result = fuse.search(message);
    return result != 0 ? result[0].item.context: null;
    };

const handleChat = async (req, res) => {
    try {
        const { message } = req.body; // user message
        
        // Send the User's Message to the OpenAI API
        const datasetAnswer = findAnswer(message);
        // console.log(datasetAnswer);

        if (!datasetAnswer) {
            return res.status(404).json({ reply: "I'm sorry, I don't have enough information to answer that." });
        }

        const prompt = `You are a personal assistant.
        Refer to her as "she" or "her" instead of using the name directly.
        Combine all relevant information provided below into a single, meaningful response.
        Summarize the most important and relevant parts of the context in your response to keep it short. 
        Always end with a polite question like “Is there anything else I can help you with?” or “How else can I assist you today?"

        If the user asks, "How are you?" or similar variations, respond as a personal assistant in a polite and engaging manner.
        Acknowledge the question but do not provide any personal details about her, as that would be unnecessary.
        For example, say something like, “I'm here and ready to assist you! How can I help?” or “Thanks for asking! I'm always here to help. What would you like to know?”

        Question: ${message}, Relevant Information: ${datasetAnswer}`;
        
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt}]
        });
        
        // Get the reply and send it to the frontend
        const reply = response.choices[0].message.content;
        console.log(reply);
        res.json({ reply }); 
    } catch (error) {
        console.error("Error with OpenAI API", error.message);
        res.status(500).json({ error: 'Something went wrong with the chatbot assistant.'});
    }
};

module.exports = { handleChat };