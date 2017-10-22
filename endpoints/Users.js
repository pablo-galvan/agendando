'use strict';

let config = require('../server/config');
let Endpoint = require('../server/modules/endpoint');
let logger = require('../server/modules/logger');

/**
 *  @swagger
 *  /v1/users/recovery:
 *    get:
 *      responses:
 *        200:
 *          description: login with email
 */
 

class Users extends Endpoint {
    registerRoutes() {
        this.api.post(`/${this.name}/recovery`, this.handlerRecovery.bind(this));
    }

    get name() {
        return 'v1/users';
    }

    handlerRecovery(req, res) {
        this.services.cupona.post(`${this.name}/recovery`, { 
            email: req.body.email
        }).then(r => {
            this.send(req, res, r);
        });
    }
}

module.exports = Users;