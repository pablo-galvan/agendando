'use strict';

let config = require('../server/config');
let Endpoint = require('../server/modules/endpoint');
let logger = require('../server/modules/logger');

/**
 *  @swagger
 *  /v1/login/email:
 *    get:
 *      responses:
 *        200:
 *          description: login with email
 */
 

class Login extends Endpoint {
    registerRoutes() {
        this.api.post(`/${this.name}/email`, this.handlerEmail.bind(this));
        this.api.post(`/${this.name}/facebook`, this.handlerFacebook.bind(this));
    }

    get name() {
        return 'v1/login';
    }

    handlerEmail(req, res) {
        this.services.cupona.post(`${this.name}/email`, { 
            mail: req.body.mail,
            password: req.body.password,
            os: req.body.os,
            fingerprint: req.body.fingerprint,
            device_token: req.body['device_token']
        }).then(r => {
            this.send(req, res, r);
        });
    }

    handlerFacebook(req, res) {
        this.services.cupona.post('v1/login/facebook', {
            os: req.body.os,
            device_token: req.body['device_token'],
            facebook_token: req.body['facebook_token'],
            fingerprint: req.body.fingerprint
        }).then(r => {
            this.send(req, res, r);
        });
    }
}

module.exports = Login;