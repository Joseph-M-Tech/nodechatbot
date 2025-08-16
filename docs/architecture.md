# Medical Chatbot Architecture

## System Overview

```
Client → API Gateway → Microservices → Database
                     ↗
NLP Service
```

## Components

1. **API Gateway**
   - Handles all incoming requests
   - Routes to appropriate services
   - Manages authentication

2. **User Service**
   - Manages user accounts
   - Handles authentication
   - Manages profiles

3. **Chatbot Service**
   - Processes natural language
   - Handles conversation flow
   - Integrates with NLP providers

4. **Appointment Service**
   - Manages scheduling
   - Handles reminders
   - Integrates with calendar systems