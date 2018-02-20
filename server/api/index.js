const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const security = require('../middlewares/securityMiddleware');

const api = express();

if (!process.env.API_KEY) {
  console.log('You have to set "API_KEY" environment variable!'); // eslint-disable-line no-console
}

api.use(bodyParser.json());

api.post('/user/login', (req, res) => {
  res.json({
    token: jwt.sign({
      verified: true,
    }, process.env.API_KEY),
  });
});

api.use(security).get('/abcd', (req, res) => res.json({ a: 'b' }));

module.exports = api;
