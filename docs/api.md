# Medical Chatbot API Documentation

## Authentication

### Register User
`POST /api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Login User
`POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

## Chatbot

### Process Message
`POST /api/chatbot/message`

**Request Body:**
```json
{
  "userId": "1234567890",
  "message": "I have a headache"
}
```