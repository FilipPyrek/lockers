const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const security = require('../middlewares/securityMiddleware');


const api = express();

if (!process.env.API_KEY) {
  console.log('You have to set "API_KEY" environment variable!'); // eslint-disable-line no-console
}

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
});

api.use(bodyParser.json());

class AuthError extends Error {}
api.post('/user/login', (req, res) =>
  pool.connect()
    .then((conn) =>
      conn.query(
        'SELECT password FROM users WHERE email = $1 LIMIT 1',
        [req.body.email.toLowerCase()]
      )
      .then(({ rows }) => {
        if (rows.length === 0) throw new AuthError('User not found.');
        return rows[0].password;
      })
      .then((hashedPassword) =>
        bcrypt.compare(req.body.password, hashedPassword)
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
    .catch((err) => {
      if (err instanceof AuthError) {
        res.json({
          code: 401,
          error: 'Špatný email nebo heslo.',
        });
        return;
      }
      console.log(err); // eslint-disable-line no-console
      res.status(500).json({
        code: 500,
        error: 'Internal Server Error',
      });
    })
);

api.use(security).get('/abcd', (req, res) =>
  pool.connect()
    .then((conn) =>
      conn.query('SELECT * FROM users')
        .then((result) => res.json(result.rows)
    )
));

module.exports = api;
