require('./enviroment/env');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== "test") {
  mongoose.connect('mongodb://localhost/authapp');
  mongoose.connection
    .once('open', () => console.log('Connected to Mongodb'))
    .on('error', error => console.log(`Mongodb Connection Error: ${error}`));
}

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