const axios = require('axios');

class NLPService {
  constructor() {
    this.apiKey = process.env.CHATBOT_API_KEY;
    this.apiUrl = process.env.CHATBOT_URL;
  }

  async processMessage(message) {
    try {
      const response = await axios.post(this.apiUrl, {
        input: { text: message },
        alternate_intents: true
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      return {
        intent: response.data.intents[0]?.intent || 'fallback',
        confidence: response.data.intents[0]?.confidence || 0,
        entities: response.data.entities || []
      };
    } catch (error) {
      console.error('NLP Service Error:', error);
      throw new Error('Failed to process message with NLP service');
    }
  }
}

module.exports = new NLPService();