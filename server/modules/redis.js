'use strict';

let config = require('../config');
let redis = require('express-redis-cache')({
    host: config.get('modules').cache.redis.host,
    port: config.get('modules').cache.redis.port
});
let Promise = require('bluebird');

class Redis {
    constructor() {
        this.cacheServer = redis;
    }

    add(key, body, expire) {
        return new Promise((resolve, reject) => {
            this.cacheServer.add(key, body, expire, (err, amount) => {
                if (err) {
                    return reject(err);
                }
                return resolve(amount);
            });
        });
    }

    del(key) {
        return new Promise((resolve, reject) => {
            this.cacheServer.del(key, (err, amount) => {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    status: 200,
                    data: {
                        success: !err ? true : false,
                        message: `Clear: ${amount} deletions`
                    }
                });
            })
        })
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this.cacheServer.get(key, (err, entries) => {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    status: 200,
                    data: entries.length != 0 ? JSON.parse(entries[0].body) : entries
                });
            });
        })
    }

    getAll() {
        return new Promise((resolve, reject) => {
            this.cacheServer.get((err, entries) => {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    status: 200,
                    data: entries
                });
            });
        })
    }

    size() {
        return new Promise((resolve, reject) => {
            this.cacheServer.size((err, bytes) => {
                if (err) {
                    return reject(err);
                }
                return resolve(bytes);
            });
        });
    }

    route(seconds) {
        return this.cacheServer.route(seconds);
    }
}

module.exports = Redis;