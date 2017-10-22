'use strict';

let config = require('../config');
let Service = require('../modules/service');

const HOST = config.get('modules').services.vale.host;

class Vale extends Service {

    get host() {
        return HOST;
    }

    get health() {
        return '';
    }

    toString() {
        return 'vale';
    }

}

module.exports = Vale;
