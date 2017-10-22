'use strict';

let config = require('../config');

class Time {
    constructor() {}

    toMilliseconds(str) {
        let strArray = str.split(' ');
        let milliseconds = config.get('time')[strArray[1]];

        return milliseconds * strArray[0];
    }
}

module.exports = new Time;