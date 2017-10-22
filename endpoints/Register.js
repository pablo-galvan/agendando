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
 

class Register extends Endpoint {
    registerRoutes() {
        this.api.post(`/${this.name}`, this.handlerPost.bind(this));
    }

    get name() {
        return 'v1/register';
    }

    handlerPost(req, res) {
        this.services.cupona.post(this.name, req.body).then(r => {
            this.send(req, res, r);
        });
    }
}

module.exports = Register;