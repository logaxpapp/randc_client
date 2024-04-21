import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../index.mjs';
import User from '../data/mockData.mjs';

describe('hashPassword', () => {
  it('should return a hash of the inputted password', async () => {
    const password = 'password';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });
});

// Mock the User.find method
jest.mock('../data/mockData.mjs', () => ({
    find: jest.fn()
  }));
  
  describe('GET /api/users', () => {
    it('should return all users when no filter is provided', async () => {
      const mockUsers = [
        { username: 'john', firstName: 'John', lastName: 'Doe' },
        { username: 'jane', firstName: 'Jane', lastName: 'Doe' }
      ];
  
      User.find.mockResolvedValue(mockUsers); // Mock the response of User.find
  
      const response = await request(app).get('/api/users');
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(User.find).toHaveBeenCalledWith({}); // Ensure User.find was called without filters
    });
  
    it('should filter users by query parameter', async () => {
      const mockFilteredUsers = [{ username: 'jane', firstName: 'Jane', lastName: 'Doe' }];
      User.find.mockImplementation(() => ({
        where: jest.fn().mockReturnThis(),
        regex: jest.fn().mockReturnThis(),
        or: jest.fn().mockResolvedValue(mockFilteredUsers),
        exec: jest.fn().mockResolvedValue(mockFilteredUsers)
      }));
  
      const response = await request(app).get('/api/users?filter=jane');
  
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(mockFilteredUsers);
      // Add more specific expectations here if necessary, e.g., to check that the query was constructed correctly
    });
  
    // Add more test cases as needed, e.g., to cover error handling
  });
