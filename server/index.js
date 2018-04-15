/* eslint consistent-return:0 */

const express = require('express');
const path = require('path');
const logger = require('./logger');

const api = require('./api');
const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const resolve = require('path').resolve;
const app = express();

// Docs for API
app.use('/docs/?(index.html)?', (req, res) =>
  res.sendFile(path.join(__dirname, '../docs/index.html'))
);

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
app.use('/api', api);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  logger.appStarted(port, prettyHost);
});
