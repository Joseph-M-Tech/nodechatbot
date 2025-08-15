const express = require('express');
const router = express.Router();
const ChatbotController = require('../controllers/chatbot');
const authMiddleware = require('../middleware/auth');

// Process user message (protected route)
router.post('/message', authMiddleware, ChatbotController.processMessage);

module.exports = router;