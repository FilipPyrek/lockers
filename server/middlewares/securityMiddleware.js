const jwtMiddleware = require('express-jwt');
const { compose } = require('compose-middleware');

const security = compose(
  jwtMiddleware({
    secret: process.env.API_KEY,
    getToken: (req) => req.query.token,
  }),
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({ invalidToken: true });
      return;
    }
    next();
  }
);

module.exports = security;
