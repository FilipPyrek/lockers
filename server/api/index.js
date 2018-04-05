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
  userLogin: require('./user/login'),
  lockerLayout: require('./map/get'),
  lockerLayoutById: require('./map/byId'),
  lockerLayoutAdd: require('./map/add'),
  lockerLayoutDuplicate: require('./map/duplicate'),
  lockerLayoutEdit: require('./map/edit'),
  lockerLayoutRemove: require('./map/remove'),
  schoolYear: require('./schoolYear/get'),
  schoolYearCreate: require('./schoolYear/add'),
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

api.use(security).get('/locker/layout', handlers.lockerLayout);
api.use(security).get('/locker/layout/:id', handlers.lockerLayoutById);
api.use(security).post('/locker/layout/edit/:id', handlers.lockerLayoutEdit);
api.use(security).post('/locker/layout/add', handlers.lockerLayoutAdd);
api.use(security).post('/locker/layout/remove', handlers.lockerLayoutRemove);
api.use(security).post('/locker/layout/duplicate', handlers.lockerLayoutDuplicate);
api.use(security).get('/school-year', handlers.schoolYear);
api.use(security).post('/school-year/create', handlers.schoolYearCreate);
api.use(security).post('/school-year/duplicate', handlers.schoolYearDuplicate);
api.use(security).post('/school-year/remove', handlers.schoolYearRemove);
api.use(security).post('/school-year/edit/:id', handlers.schoolYearEdit);
api.use(security).get('/school-year/:id', handlers.schoolYearById);

module.exports = api;
