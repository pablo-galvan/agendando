'use strict';

let axios = require('axios');
let config = require('../config');
let EventEmitter = require('events').EventEmitter;
let he = require('he');
let logger = require('./logger');

const TIMEOUT = config.get('modules').services.timeout || 1000;

class Service extends EventEmitter {

    static get enabled() {
        return true;
    }

    get(url, options) {
        return this.request(url, 'get', options);
    }

    post(url, options) {
        return this.request(url, 'post', options);
    }

    put(url, options) {
        return this.request(url, 'put', options);
    }

    del(url, options) {
        return this.request(url, 'delete', options);
    }

    request(url, method, options) {
        options = options || {};
        let timeout = !!options.timeout ? options.timeout : TIMEOUT;
        let timing = process.hrtime();

        return axios[method](`${this.host}/${url}`, options, { timeout })
            .then(r => {
                this.emit('request', {
                    method: r.config.method,
                    url: url,
                    status: r.status || r.response.status,
                    time: process.hrtime(timing)[1] / 1000000, // get milliseconds of process
                    size: !!r.data ? Object.keys(r.data).length : 0
                });
                return r;
            })
            .catch(err => {
                if (err.response) {
                    err.time = process.hrtime(timing)[1] / 1000000; // get milliseconds of process
                    return this.error(err);
                }
                else {
                    logger.error(`UNHANDLER ERROR!! :: Service Class :: ${err}`);
                    return err;
                }
            });
    }

    error(err) {
        logger.error(`Error :: Service class :: ${err}`);
        this.emit('error', {
            method: err.config.method,
            status: err.response.status,
            time: err.time || 0,
            url: err.response.config.url,
            code: !!err.response.data.error ? err.response.data.error.code : 500
        });

        return {
            status: err.response.status,
            data: {
                error: err.message,
                response: err.response.data
            }
        };
    }
}

module.exports = Service;