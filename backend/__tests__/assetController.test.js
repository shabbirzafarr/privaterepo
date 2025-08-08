const request = require('supertest');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import your controller
const assetController = require('../controllers/assetController');

// Mock the model used in the controller
jest.mock('../models/assetModel');
const assetModel = require('../models/assetModel');

// Setup route for testing
app.get('/portfolio/:ps_id', assetController.getPortfolio);
app.post('/buy', assetController.buyAsset);
app.post('/sell', assetController.sellAsset);

describe('Asset Controller', () => {
  describe('GET /portfolio/:ps_id', () => {
    it('should return 400 if ps_id is missing', async () => {
      const res = await request(app).get('/portfolio/');
      expect(res.statusCode).toBe(404); // Because Express requires ps_id
    });

    it('should return asset list for valid ps_id', async () => {
      assetModel.getAssetsByUser.mockImplementation((ps_id, cb) => {
        cb(null, [{ symbol: 'AAPL', quantity: 10 }]);
      });

      const res = await request(app).get('/portfolio/123');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ symbol: 'AAPL', quantity: 10 }]);
    });
  });const request = require('supertest');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Import your controller
const assetController = require('../controllers/assetController');

// Mock the model used in the controller
jest.mock('../models/assetModel');
const assetModel = require('../models/assetModel');

// Setup routes for testing
app.get('/portfolio/:ps_id', assetController.getPortfolio);
app.post('/buy', assetController.buyAsset);
app.post('/sell', assetController.sellAsset);

describe('Asset Controller', () => {
  describe('GET /portfolio/:ps_id', () => {
    it('should return 400 if ps_id is missing', async () => {
      const res = await request(app).get('/portfolio/');
      expect(res.statusCode).toBe(404); // Missing ps_id results in 404 in Express
    });

    it('should return asset list for valid ps_id', async () => {
      assetModel.getAssetsByUser.mockImplementation((ps_id, cb) => {
        cb(null, [{ symbol: 'AAPL', quantity: 10 }]);
      });

      const res = await request(app).get('/portfolio/123');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ symbol: 'AAPL', quantity: 10 }]);
    });
  });

  describe('POST /buy', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/buy').send({});
      expect(res.statusCode).toBe(400);
    });

    it('should fail to create asset if required fields are missing', async () => {
      const res = await request(app)
        .post('/buy')
        .send({
          ps_id: 'testuser2',
          symbol: 'GOOGL'
          // missing company_name, quantity, purchase_price
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /sell', () => {
    it('should return 400 if ps_id, symbol, or quantity is missing', async () => {
      const res = await request(app).post('/sell').send({});
      expect(res.statusCode).toBe(400);
    });
  });
});


  describe('POST /buy', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/buy').send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /sell', () => {
    it('should return 400 if ps_id, symbol, or quantity is missing', async () => {
      const res = await request(app).post('/sell').send({});
      expect(res.statusCode).toBe(400);
    });
  });
  describe('POST /buy', () => {
  it('should return 400 if fields are missing', async () => {
    const res = await request(app).post('/buy').send({});
    expect(res.statusCode).toBe(400);
  });

  it('should fail to create asset if required fields are missing', async () => {
    const res = await request(app)
      .post('/buy')
      .send({
        ps_id: 'testuser2',
        symbol: 'GOOGL',
        // missing company_name, quantity, purchase_price
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

});