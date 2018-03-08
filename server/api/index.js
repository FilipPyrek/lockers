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

api.use(bodyParser.json());

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
class AuthError extends Error {}
api.post('/user/login', (req, res) =>
  Joi.validate(req.body, loginSchema)
    .then(({ email, password }) =>
      connectToMongo().then((db) =>
        db.collection('users')
          .findOne({ email: email.toLowerCase() })
            .catch(() => { throw new AuthError('User not found.'); })
            .then(({ password: hashedPassword }) =>
              bcrypt.compare(password, hashedPassword)
                .then((isMatching) => {
                  if (!isMatching) throw new AuthError('Passwords are not matching.');
                })
                .then(() =>
                  res.json({
                    code: 200,
                    message: 'Přihlášení proběhlo úspěšně.',
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
      if (err.name === 'ValidationError') {
        res.json({
          code: 400,
          error: 'Musíte zadat email a heslo.',
        });
        return;
      }
      if (err instanceof AuthError) {
        res.json({
          code: 401,
          error: 'Špatný email nebo heslo.',
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
