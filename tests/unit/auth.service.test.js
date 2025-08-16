const { expect } = require('chai');
const sinon = require('sinon');
const User = require('../../models/User');
const authService = require('../../services/auth.service');

describe('Auth Service', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const mockUser = {
        _id: '123',
        name: 'Test User',
        email: 'test@example.com',
        save: () => {}
      };
      
      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User.prototype, 'save').resolves(mockUser);

      const user = await authService.registerUser('Test User', 'test@example.com', 'password123');
      
      expect(user).to.have.property('_id');
      expect(user.email).to.equal('test@example.com');
    });
  });

  // Add more test cases...
});