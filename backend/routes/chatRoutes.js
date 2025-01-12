const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');

// POST route for the chatBot
router.post('/',handleChat);

module.exports = router;