const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const { Map } = require('immutable');
const { security, onlyAdmin } = require('../middlewares/securityMiddleware');


const api = express();

if (!process.env.API_KEY) {
  console.log('You have to set "API_KEY" environment variable!'); // eslint-disable-line no-console
}

const mongoClient = new MongoClient(
  process.env.MONGO_HOST || 'mongodb://127.0.0.1:27017',
  {
    auth: {
      user: process.env.MONGO_USER || 'lockers',
      password: process.env.MONGO_PASSWORD || 'heslo123',
    },
    authSource: process.env.MONGO_AUTH_SOURCE || 'lockers',
  }
);
const connectToMongo = () => mongoClient.connect().then((client) => client.db('lockers'));
const dependencies = { connectToMongo };

/* eslint-disable global-require */
const handlers = Map({
  user: require('./user/get'),
  userLogin: require('./user/login'),
  userAdd: require('./user/add'),
  userRemove: require('./user/remove'),
  userEdit: require('./user/edit'),
  map: require('./map/get'),
  mapById: require('./map/byId'),
  mapCreate: require('./map/create'),
  mapDuplicate: require('./map/duplicate'),
  mapEdit: require('./map/edit'),
  mapRemove: require('./map/remove'),
  schoolYear: require('./schoolYear/get'),
  schoolYearCreate: require('./schoolYear/create'),
  schoolYearDuplicate: require('./schoolYear/duplicate'),
  schoolYearById: require('./schoolYear/byId'),
  schoolYearRemove: require('./schoolYear/remove'),
  schoolYearEdit: require('./schoolYear/edit'),
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

api.use(security, onlyAdmin).get('/user', handlers.user);
api.use(security, onlyAdmin).post('/user/add', handlers.userAdd);
api.use(security, onlyAdmin).post('/user/remove', handlers.userRemove);
api.use(security, onlyAdmin).post('/user/edit/:id', handlers.userEdit);

api.use(security).get('/map', handlers.map);
api.use(security).get('/map/:id', handlers.mapById);
api.use(security).post('/map/edit/:id', handlers.mapEdit);
api.use(security).post('/map/create', handlers.mapCreate);
api.use(security).post('/map/remove', handlers.mapRemove);
api.use(security).post('/map/duplicate', handlers.mapDuplicate);
api.use(security).get('/school-year', handlers.schoolYear);
api.use(security).post('/school-year/create', handlers.schoolYearCreate);
api.use(security).post('/school-year/duplicate', handlers.schoolYearDuplicate);
api.use(security).post('/school-year/remove', handlers.schoolYearRemove);
api.use(security).post('/school-year/edit/:id', handlers.schoolYearEdit);
api.use(security).get('/school-year/:id', handlers.schoolYearById);

module.exports = api;
