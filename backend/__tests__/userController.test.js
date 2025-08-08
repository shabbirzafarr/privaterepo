const request = require('supertest');
const express = require('express');
const userController = require('../controllers/userController');

// Mock the userModel
jest.mock('../models/userModel', () => ({
  userExists: jest.fn(),
  createUser: jest.fn()
}));

const userModel = require('../models/userModel');

const app = express();
app.use(express.json());
app.post('/add-user', userController.addUser);

describe('POST /add-user', () => {
  it('should return 400 if ps_id is missing', async () => {
    const res = await request(app).post('/add-user').send({});
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error', 'ps_id is required');
  });

  it('should return "User already exists"', async () => {
    userModel.userExists.mockImplementation((ps_id, cb) => cb(null, [{}]));
    const res = await request(app).post('/add-user').send({ ps_id: '123' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User already exists');
  });

  it('should create a new user successfully', async () => {
    userModel.userExists.mockImplementation((ps_id, cb) => cb(null, []));
    userModel.createUser.mockImplementation((ps_id, cb) => cb(null));

    const res = await request(app).post('/add-user').send({ ps_id: '456' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('User created successfully');
  });
});