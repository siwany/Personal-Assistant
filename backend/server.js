const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chatRoutes')

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors()); // enable CORS
app.use(express.json());

app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.send('Backend server is running successfully.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





