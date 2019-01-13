/* eslint-disable no-console */

const chalk = require('chalk');
const _format = require('date-fns/format');

// Format for the date
const FORMAT = 'MM-DD-YYYY hh:mm:ss A';
// Current date
const date = _format(new Date(), FORMAT);
// Log the current date
console.log(chalk.blue('[nodemon]', date));
