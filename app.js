const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();

const port = process.env.PORT || 5000;

const routes = require('./routes/users');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

const server = app.listen(port, () => {
  const host =  'localhost';
  console.log(`App is listening at http://${host}:${port}`);
});

module.exports = app;