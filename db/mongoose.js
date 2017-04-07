const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/authapp');
mongoose.connection
  .once('open', () => console.log('Connected to Mongodb'))
  .on('error', error => console.log(`Mongodb Connection Error: ${error}`));

module.exports = mongoose;