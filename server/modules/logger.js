'use strict';

let winston = require('winston');
let config = require('../config');

config = config.get('winston');

module.exports = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            colorize: true
        })
    ],
    levels: config.levels,
    colors: config.colors
});

