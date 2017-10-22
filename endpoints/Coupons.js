'use strict';

let config = require('../server/config');
let Endpoint = require('../server/modules/endpoint');
let logger = require('../server/modules/logger');

/**
 *  @swagger
 *  /v1/cupones:
 *    get:
 *      responses:
 *        200:
 *          description: List of coupons
 */
 
 /**
 *  @swagger
 *  /v1/cupones/:id/codigo:
 *    post:
 *      responses:
 *        200:
 *          description: Request a coupon
 */

class Coupons extends Endpoint {
    registerRoutes() {
        this.api.get(`/${this.name}`, this.cache('5 minutes'), this.handlerGet.bind(this));
        this.api.get(`/${this.name}/:id`, this.handlerSingularGet.bind(this));
        this.api.post(`/${this.name}/:id/codigo`, this.handlerPost.bind(this));
    }

    get name() {
        return 'v1/cupones';
    }

    handlerSingularGet(req, res) {
        this.services.cupona.get(`${this.name}/${req.params.id}`, { 
            params: {
                token: req.query.token
            }
        }).then(r => {
            this.send(req, res, r);
        });
    }


    handlerGet(req, res) {
        let params = {
            token: req.query.token,
            withRestricted: true
        };

        if (!!req.query.page) {
            params.page = req.query.page;
        }

        this.services.cupona.get(this.name, { params }).then(r => {
            this.send(req, res, r);
        });
    }

    handlerPost(req, res) {
        this.services.cupona.post(`${this.name}/${req.params.id}/codigo?token=${req.query.token}`).then(r => {
            this.send(req, res, r);
        });
    }
}

module.exports = Coupons;