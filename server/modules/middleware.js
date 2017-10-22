'use strict';

let _ = require('underscore');
let e = require('../helpers/e');
let Promise = require('bluebird');

class Middleware {

    static get isEnabled() {
        return true;
    }

    static get weight() {
        return 10;
    }

    handler(req, res, next) {
        return Promise.bind(this)
            .then(() => {
                return this.handle(req, res);
            })
            .then(() => {
                next();
                return null;
            })
            .catch(e.CancellationException, _.noop)
            .catch(next);
    }

    handle() {}

}

module.exports = Middleware;
