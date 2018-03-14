const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const Joi = require('joi');
const security = require('../middlewares/securityMiddleware');


const api = express();

if (!process.env.API_KEY) {
  console.log('You have to set "API_KEY" environment variable!'); // eslint-disable-line no-console
}

const mongoClient = new MongoClient('mongodb://localhost:27017', { auth: { user: 'lockers', password: 'heslo123' } });
const connectToMongo = () => mongoClient.connect().then((client) => client.db('lockers'));

api.use(bodyParser.json(), (err, req, res, next) => {
  if (!err) return next();
  res.json({
    code: 400,
    error: 'Nevalidní JSON',
  });
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required().error(() => ({ message: 'Musíte zadat email v platném tvaru např. jmeno@domena.com' })),
  password: Joi.string().required().error(() => ({ message: 'Musíte zadat heslo' })),
});
class AuthError extends Error {}
api.post('/user/login', (req, res) =>
  Joi.validate(req.body, loginSchema)
    .then(({ email, password }) =>
      connectToMongo().then((db) =>
        db.collection('users')
          .find({ email: email.toLowerCase() })
            .toArray()
            .then((data) => {
              if (data.length === 0) {
                throw new AuthError('User not found');
              }
              return data[0];
            })
            .then(({ password: hashedPassword }) =>
              bcrypt.compare(password, hashedPassword)
                .then((isMatching) => {
                  if (!isMatching) throw new AuthError('Passwords are not matching');
                })
                .then(() =>
                  res.json({
                    code: 200,
                    message: 'Přihlášení proběhlo úspěšně',
                    response: {
                      token: jwt.sign({
                        verified: true,
                      }, process.env.API_KEY),
                    },
                  })
                )
            )
        )
    )
    .catch((err) => {
      if (err.isJoi && err.name === 'ValidationError') {
        res.json({
          code: 400,
          error: err.details.reduce(
            (errors, error) => Object.assign(
              errors,
              {
                [error.path]: error.message,
              }
            )
          , {}),
        });
        return;
      }
      if (err instanceof AuthError) {
        res.json({
          code: 401,
          error: 'Zadali jste špatný email nebo heslo. Překontrolujte údaje.',
        });
        return;
      }
      console.error(err); // eslint-disable-line no-console
      res.status(500).json({
        code: 500,
        error: 'Internal Server Error',
      });
    })
);

api.use(security).get('/abcd', (req, res) =>
  connectToMongo()
    .then((db) =>
       db.collection('test').findOne({})
       .then((data) => res.json(data))
    )
);

module.exports = api;
