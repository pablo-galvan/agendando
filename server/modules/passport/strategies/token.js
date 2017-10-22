'use strict';

let _ = require('underscore');
let config = require('../../../config');
let e = require('../../../helpers/e');
let logger = require('../../logger');
let Promise = require('bluebird');
let service = require('../../service');
let Strategy = require('passport').Strategy;

const TTL = config.get('modules').passport.strategies.token.ttl;
const OPTIONS = config.get('modules').passport.strategies.token.options;
const SEPARATOR = '|';
const CREDENTIALS = config.get('modules').passport.strategies.token.credentials;

class Token extends Strategy {
    constructor(passport) {
        super();
        this.passport = passport;
    }

    get name() {
        return 'token';
    }

    static get enabled() {
        return false;
    }

    authenticate(req) {
        let user = req[this.credentials.user.location][this.credentials.user.name];
        let token = req[this.credentials.token.location][this.credentials.token.name];

        Promise.bind(this)
            .then(() => {
                return this.verify(user, token);
            })
            .then(() => {
                return {
                    id: user
                };
            })
            .catch(e.UnnecessaryAuthenticationException, _.noop)
            .then(user => {
                this.success(user);
                return null;
            })
            .catch(error => {
                this.error(error);
                return null;
            });
    }

    verify(user, token) {
        if (!token || !user) {
            throw new e.MissingCredentialsException();
        }
        return this.decrypt(token)
            .then(token => {
                return this.validate(user, token);
            });
    }

    decrypt(token) {
        return Promise.bind(this)
            .then(() => {
                // TODO: solo es una muestra de como comparar hash o de validarlos
                // return crypt.comparePass(token, config.get('crypt').token);
            })
            .catch(() => {
                throw new e.InvalidCredentialsException();
            });
    }

    validate(user, isValid) {
        if (!isValid) {
            throw new e.InvalidCredentialsException();
        }

        // Ejemplo te implementación
        // if (isNaN(decryptedUser) ||
        //     isNaN(decryptedTimestamp) ||
        //     decryptedUser !== user ||
        //     Date.now() - decryptedTimestamp > this.tll
        // ) {
        //     throw new e.InvalidCredentialsException();
        // }
    }

    authentication(req, res, next) {
        this.passport.authenticate(this.name, this.options, (error, user) => {
            if (error) {
                return this.error(req, res, error, next);
            }
            this.logIn(req, res, user, next);
        })(req, res, next);
    }

    error(req, res, error) {
        res.status(401).send({
            status: 401,
            errors: [error.message]
        });
    }

    logIn(req, res, user, next) {
        req.logIn(user, this.options, () => {
            next();
        });
    }

    get middleware() {
        return this.authentication.bind(this);
    }

    get credentials() {
        return CREDENTIALS;
    }

    get ttl() {
        return TTL;
    }

    get separator() {
        return SEPARATOR;
    }

    get options() {
        return OPTIONS;
    }

}

module.exports = Token;
