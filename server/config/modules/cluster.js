'use strict';

let os = require('os');

module.exports = {
	enabled: true,
	workers: os.cpus().length
};