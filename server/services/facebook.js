'use strict';

let config = require('../config');
let Service = require('../modules/service');

const HOST = config.get('modules').services.facebook.host;

class Facebook extends Service {

    get host() {
        return HOST;
    }

    get health() {
        return '';
    }

    toString() {
        return 'facebook';
    }

}

module.exports = Facebook;
