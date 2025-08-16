require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  jwtExpiration: process.env.JWT_EXPIRATION || '24h',
  saltRounds: parseInt(process.env.SALT_ROUNDS) || 10
};