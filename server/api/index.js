const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { Map } = require('immutable');
const security = require('../middlewares/securityMiddleware');


const api = express();

if (!process.env.API_KEY) {
  console.log('You have to set "API_KEY" environment variable!'); // eslint-disable-line no-console
}

const mongoClient = new MongoClient('mongodb://localhost:27017', { auth: { user: 'lockers', password: 'heslo123' } });
const connectToMongo = () => mongoClient.connect().then((client) => client.db('lockers'));
const dependencies = { connectToMongo };

/* eslint-disable global-require */
const handlers = Map({
  userLogin: require('./lockerLayoutAdd'),
  lockerLayoutAdd: require('./lockerLayoutAdd'),
})
/* eslint-enable */
.map((func) => func(dependencies))
.toJS();

api.use(bodyParser.json(), (err, req, res, next) => {
  if (!err) return next();
  res.json({
    code: 400,
    error: 'Nevalidní JSON',
  });
});


api.post('/user/login', handlers.userLogin);

api.use(security).post('/locker/layout/add', handlers.lockerLayoutAdd);

module.exports = api;
