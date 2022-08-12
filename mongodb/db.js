'use strict';

const mongoose = require('mongoose');
const config = require('config-lite')(__dirname);
const chalk = require('chalk');
mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect(config.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log(chalk.green('MongoDB Connection Succeeded.'))
  } else {
    console.log(chalk.red('Error in DB connection: ' + err))
  }
});

module.exports = mongoose