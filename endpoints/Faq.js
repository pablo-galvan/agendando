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
 *          description: Get the frequently answers questions 
 */
 

class Faq extends Endpoint {
    registerRoutes() {
        this.api.get(`/${this.name}`, this.cache('1 hour'), this.handlerGet.bind(this));
    }

    get name() {
        return 'v1/faq';
    }

    handlerGet(req, res) {
        this.services.cupona.get(this.name).then(r => {
            this.send(req, res, r);
        });
    }
}

module.exports = Faq;