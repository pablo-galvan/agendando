'use strict';

let config = require('../config');
let Service = require('../modules/service');

const HOST = config.get('modules').services.weather.host;
const API_KEY = config.get('modules').services.weather.apiKey;

class Weather extends Service {

    get host() {
        return HOST;
    }

    get health() {
        return '';
    }

    get apiKey() {
        return API_KEY;
    }

    toString() {
        return 'weather';
    }

}

module.exports = Weather;
