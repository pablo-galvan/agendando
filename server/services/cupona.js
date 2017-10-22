'use strict';

let config = require('../config');
let Service = require('../modules/service');

const HOST = config.get('modules').services.cupona.host;

class Cupona extends Service {

    get host() {
        return HOST;
    }

    get health() {
        return '';
    }

    toString() {
        return 'cupona';
    }

}

module.exports = Cupona;
