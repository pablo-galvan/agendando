'use strict';

let config = require('../config');
let logger = require('../modules/logger');
let Redis = require('../modules/redis');
let Service = require('../modules/service');
let Promise = require('bluebird');

const HOST = config.get('modules').services.bort.host;

class Bort extends Service {
    constructor() {
        super();

        this.cacheServer = new Redis();
    }

    get host() {
        return HOST;
    }

    get health() {
        return '';
    }

    toString() {
        return 'bort';
    }

    getFromCache(key, options) {
        return new Promise((resolve, reject) => {
            if (typeof key == 'undefined' || key.length == 0) {
                return reject('key undefined');
            }
            let url = key.replace('_', '/');

            this.cacheServer.get(key).then((entries) => {
                if (entries.data.length != 0) {
                    return resolve(entries.data);
                }
                else {
                    this.get(url, options).then((r) => {
                        if (r.status == 200) {
                            this.cacheServer.add(key, JSON.stringify(r.data), -1).then(amount => {
                                logger.info(`Cache Add :: ${key} -> ${amount}`);
                            });
                            return resolve(r.data);
                        }
                        else {
                            return reject(r);
                        }
                    });
                }
            }).catch(err => {
                return reject(err);
            });
        });
    }

    putCache(key, url, options, callback) { // REFACTOR
        let resFromCache;

        Promise.bind(this)
            .then(() => {
                this.cacheServer.get(key, (err, entries) => {
                    resFromCache = entries;
                });
            })
            .then(() => {
                this.get(url, options, (res) => {
                    if (res.response.statusCode == 200) {
                        if (res.data == resFromCache) {
                            return callback({
                                response: {
                                    statusCode: 304
                                },
                                data: {
                                    status: 'not modified'
                                }
                            });
                        }
                        else {
                            this.put(url, options, (res) => {
                                this.cacheServer.add(key, res.data, (err, add) => {});
                                return callback(res.data);
                            });
                        }
                    }
                    return callback(res.data);
                });
            })
            .catch(e => {
                logger.error(e);
            });
    }
}

module.exports = Bort;
