'use strict';

let config = require('../server/config');
let Endpoint = require('../server/modules/endpoint');
let logger = require('../server/modules/logger');

/**
 *  @swagger
 *  /api/health:
 *    get:
 *      responses:
 *        200:
 *          description: Devuelve un health check de sus servicios 
 */

class Health extends Endpoint {
    registerRoutes() {
        this.api.get('/health', this.handlerGet.bind(this));
        this.api.get('/delete/cache/'), this.handlerDelete.bind(this);
    }

    handlerGet(req, res, next) {
        if (req.query.pass != 'bondacom13') {
            return this.send(req, res, {
                status: 401,
                data: {
                    message: 'Not Authorized'
                }
            });
        }

        if (config.get('modules').cache.redis.enabled) {
            this.cacheServer.size().then(r => {
                this.cacheServer.getAll().then(all => {
                    this.send(req, res,  {
                        status: 200,
                        data: {
                            name: 'surma',
                            memory: process.memoryUsage(),
                            redis: {
                                size: r,
                                all: all
                            }
                        }
                    });
                });
            });
        }
        else {
            this.send(req, res,  {
                status: 200,
                data: {
                    name: 'surma',
                    memory: process.memoryUsage()
                }
            });
        }
    }

    handlerDelete(req, res, next) {
        if (req.query.pass != 'bondacom13') {
            return this.send(req, res, {
                status: 401,
                data: {
                    message: 'Not Authorized'
                }
            });
        }

        this.cacheServer.del(req.query.name).then((deletion) => {
            this.send(req, res, deletion);
        }).catch(err => {
            this.error(res, err);
        });
    }
}

module.exports = Health;