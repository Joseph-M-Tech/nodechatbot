const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authConfig = require('../config/auth.config');

class AuthService {
  async registerUser(name, email, password) {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const user = new User({
        name,
        email,
        password
      });

      await user.save();
      return user;
    } catch (error) {
      console.error('Auth Service Error:', error);
      throw new Error('Failed to register user');
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { _id: user._id },
        authConfig.jwtSecret,
        { expiresIn: authConfig.jwtExpiration }
      );

      return { user, token };
    } catch (error) {
      console.error('Auth Service Error:', error);
      throw new Error('Failed to login user');
    }
  }
}

module.exports = new AuthService();