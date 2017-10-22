'use strict';

let config = require('../server/config');
let Endpoint = require('../server/modules/endpoint');
let logger = require('../server/modules/logger');

/**
 *  @swagger
 *  /v1/mobile/info:
 *    get:
 *      responses:
 *        200:
 *          description: 
 */
 

class Orders extends Endpoint {
    registerRoutes() {
        this.api.get(`/${this.name}`, this.handlerGet.bind(this));
    }

    get name() {
        return 'v1/orders';
    }

    handlerGet(req, res) {
        this.services.cupona.get(this.name, { params: { token: req.query.token }}).then(r => {
            this.send(req, res, r);
        });
    }
}

module.exports = Orders;