const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());

app.post('/abc', (req, res) => {
  res.json({
    token: jwt.sign({
      verified: true,
      email: req.body.email,
    }, 'key'),
  });
});

module.exports = app;
