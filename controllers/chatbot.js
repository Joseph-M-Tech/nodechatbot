const axios = require('axios');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// Integration with NLP service (IBM Watson example)
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY;
const CHATBOT_URL = process.env.CHATBOT_URL;

class ChatbotController {
    // Process user message
    static async processMessage(req, res) {
        try {
            const { userId, message } = req.body;
            
            // Send to NLP service
            const response = await axios.post(CHATBOT_URL, {
                input: { text: message },
                alternate_intents: true
            }, {
                headers: {
                    'Authorization': `Bearer ${CHATBOT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const intent = response.data.intents[0].intent;
            const confidence = response.data.intents[0].confidence;
            
            if (confidence < 0.7) {
                return res.json({
                    response: "I'm not sure I understand. Could you rephrase that or provide more details?"
                });
            }
            
            let botResponse = '';
            
            // Handle different intents
            switch(intent) {
                case 'book_appointment':
                    botResponse = await this.handleAppointmentIntent(userId, response.data);
                    break;
                case 'symptom_check':
                    botResponse = await this.handleSymptomIntent(userId, response.data);
                    break;
                case 'medication_question':
                    botResponse = "I can provide general information about medications, but for specific advice, please consult your doctor.";
                    break;
                default:
                    botResponse = "How can I assist you with your medical needs today?";
            }
            
            res.json({ response: botResponse });
            
        } catch (error) {
            console.error('Chatbot error:', error);
            res.status(500).json({ error: 'Error processing your message' });
        }
    }
    
    static async handleAppointmentIntent(userId, data) {
        // Extract entities from NLP response
        const dateEntity = data.entities.find(e => e.entity === 'sys-date');
        const timeEntity = data.entities.find(e => e.entity === 'sys-time');
        const reasonEntity = data.entities.find(e => e.entity === 'reason');
        
        if (!dateEntity || !timeEntity || !reasonEntity) {
            return "To book an appointment, I need to know the date, time, and reason for your visit. Could you provide those details?";
        }
        
        try {
            // Create appointment
            const appointment = new Appointment({
                userId,
                dateTime: new Date(`${dateEntity.value} ${timeEntity.value}`),
                reason: reasonEntity.value
            });
            
            await appointment.save();
            
            // Update user's appointments
            await User.findByIdAndUpdate(userId, {
                $push: { appointments: appointment._id }
            });
            
            return `Your appointment has been booked for ${dateEntity.value} at ${timeEntity.value} for ${reasonEntity.value}. You'll receive a confirmation shortly.`;
            
        } catch (error) {
            console.error('Appointment error:', error);
            return "There was an error booking your appointment. Please try again or contact our office directly.";
        }
    }
    
    static async handleSymptomIntent(userId, data) {
        // Extract symptoms
        const symptoms = data.entities
            .filter(e => e.entity === 'symptom')
            .map(e => e.value);
            
        if (symptoms.length === 0) {
            return "Could you describe your symptoms in more detail?";
        }
        
        // Simple symptom analysis (in a real app, this would connect to a medical knowledge base)
        const symptomList = symptoms.join(', ');
        
        // Check for emergency symptoms
        const emergencySymptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'loss of consciousness'];
        const isEmergency = symptoms.some(s => 
            emergencySymptoms.includes(s.toLowerCase()));
            
        if (isEmergency) {
            return `You're describing ${symptomList} which may be serious. Please call emergency services immediately or go to the nearest emergency room.`;
        }
        
        // Suggest appointment if symptoms are concerning
        const concerningSymptoms = ['fever', 'persistent cough', 'severe headache'];
        const isConcerning = symptoms.some(s => 
            concerningSymptoms.includes(s.toLowerCase()));
            
        if (isConcerning) {
            return `Based on your symptoms (${symptomList}), I recommend scheduling an appointment with a doctor. Would you like to book one now?`;
        }
        
        return `For ${symptomList}, I recommend rest and hydration. However, if symptoms persist or worsen, please contact a healthcare provider. Would you like to schedule an appointment?`;
    }
}

module.exports = ChatbotController;