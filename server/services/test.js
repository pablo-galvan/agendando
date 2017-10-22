'use strict';

let config = require('../config');
let Service = require('../modules/service');

const HOST = config.get('modules').services.test.host;

class Test extends Service {

    get host() {
        return HOST;
    }

    get health() {
        return '';
    }

    toString() {
        return 'test';
    }

}

module.exports = Test;
