'use strict';

let _ = require('underscore');
let config = require('../../config');
let logger = require('../logger');
let Redis = require('../redis');
let services = require('../../services');
let passport = require('../passport');
let time = require('../../helpers/time');
let util = require('util');

class Endpoint {
    constructor(api) {
        this.api = api;
        this.config = config;
        this.defaultCache = '30 minutes';
        this.services = services;
        this.errors = [];
        this.passport = passport;

        if (config.get('modules').cache.redis.enabled) {
            this.cacheServer = new Redis();
        }

        this.registerRoutes();
    }

    static isEnabled() {
        return true;
    }

    get name() {}

    registerRoutes() {}

    validate() {}

    handler() {}

    cache(duration) {
        duration = duration || this.defaultCache;
        let toTime = time.toMilliseconds(duration);
        let seconds = time.toMilliseconds(duration) / 1000;
        let mtime = new Date();
        let moduleCache = config.get('modules').cache;

        if (moduleCache.enabled) {
            if (moduleCache.http.enabled) {
                return (req, res, next) => {
                    if (!res.getHeader('Cache-Control'))  {
                        res.setHeader('Cache-Control', 'public, max-age=' + toTime);
                        res.setHeader("Expires", new Date(Date.now() + toTime).toUTCString());
                        res.setHeader("Last-Modified", mtime.toUTCString());
                    }

                    next();
                };
            }
            else if (moduleCache.redis.enabled) {
                return this.cacheServer.route(seconds);
            } else {
                return (req, res, next) => { 
                    next(); 
                };
            }
        }
    }

    notExpire() {
        return false;
    }

    cacheShow(req, res, next) {
        this.cacheServer.get(`/api/${this.name}`).then(entries => {
            this.send(req, res, entries);
        }).catch(err => {
            this.error(err);
        });
    }

    cacheClear(req, res, next) {
        this.cacheServer.del(`/api/${this.name}`).then((deletion) => {
            this.send(req, res, deletion);
        }).catch(err => {
            this.error(res, err);
        });
    }

    cleanCache(id) {
        let route = `/api/${this.name}`;

        return new Promise((resolve, reject) => {
            this.cacheServer.del(route).then((del) => {
                this.cacheServer.del(`${route}/`);
                logger.info(`${route} :: ${del.data.message}`);
                return resolve(true)
            }).catch(err => {
                logger.error(`${route} :: Error: ${err}`);
                return reject(err);
            });
        }).then(r => {
            if (!!id) {
                this.cacheServer.del(`${route}/${id}`).then((del) => {
                    logger.info(`${route}${id} :: ${del.data.message}`);
                    return true;
                }).catch(err => {
                    logger.error(`${route}${id} :: Error: ${del.data.message}`);
                    return this.error(res, err);
                });
            }
            return true;
        }).catch(err => {
            return this.error(res, err);
        });
    }

    error(res, err) {
        if (!_.isEmpty(this.errors)) {
            err = this.errors;
        }
        logger.error(`Error: status: ${err.response.status} message: ${err.data.message}`);

        this.response(res, {
            status: err.status || 500,
            data: {
                error: {
                    type: err.type || {},
                    status: err.response.status
                },
                message: err.message // TODO: revisar respuesta
            }
        });
    }

    send(req, res, result) {
        //TODO: comprobaciones de resultados

        return this.response(res, result);
    }

    response(res, result) {
        res.status(result.status).json(result.data);
    }
}

module.exports = Endpoint;