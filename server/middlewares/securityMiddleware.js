const jwtMiddleware = require('express-jwt');
const { compose } = require('compose-middleware');

const security = compose(
  jwtMiddleware({
    secret: process.env.API_KEY,
    getToken: (req) => req.query.token,
  }),
  (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
      res.json({
        code: 401,
        message: 'Přihlášení vypršelo.',
        error: {
          token: 'expired',
        },
      });
      return;
    }
    next();
  }
);

const onlyApi = (req, res, next) => {
  if (req.user.isApi) {
    next();
    return;
  }
  res.json({
    code: 403,
    message: 'Přístup odmítnut.',
    error: {
      access: 'denied',
    },
  });
};

const onlyAdmin = (req, res, next) => {
  if (!req.user.isApi) {
    next();
    return;
  }
  res.json({
    code: 403,
    message: 'Přístup odmítnut.',
    error: {
      access: 'denied',
    },
  });
};

module.exports = {
  onlyApi,
  onlyAdmin,
  security,
};
