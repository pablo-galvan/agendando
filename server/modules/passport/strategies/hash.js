'use strict';

let _ = require('underscore');
let config = require('../../../config');
let crypt = require('../../../helpers/crypt');
let e = require('../../../helpers/e');
let logger = require('../../logger');
let Promise = require('bluebird');
let services = require('../../../services');
let Strategy = require('passport').Strategy;

const SEPARATOR = '|||';
const CREDENTIALS = config.get('modules').passport.strategies.hash.credentials;

class Hash extends Strategy {
    constructor(passport) {
        super();
        this.passport = passport;
        this.services = services;
    }

    get name() {
        return 'token';
    }

    static get enabled() {
        return true;
    }

    authenticate(req) {
        let sessionId = req[this.credentials.session.location][this.credentials.session.name];
        let hash = req[this.credentials.hash.location][this.credentials.hash.name];

        Promise.bind(this)
            .then(() => {
                return this.verify(sessionId, hash);
            })
            .then((r) => {
                return {
                    id: r.sessions[0].administrator_id
                };
            })
            .catch(e.UnnecessaryAuthenticationException, _.noop)
            .then(user => {
                if (typeof req.session.passport.user != 'undefined') {
                    return this.success(req.session.passport.user);
                }

                this.services.bort.get(`administrators/${user.id}`, {}).then(r => {
                    if (typeof r.data == 'undefined') {
                        logger.error(r.response.data);
                        throw new e.NotImplementedException();
                    }

                    return this.success(r.data.administrator);
                }).catch(e => {
                    logger.error(e);
                });
                return null;
            })
            .catch(error => {
                this.error(error);
                return null;
            });
    }

    verify(sessionId, hash) {
        if (!hash || !sessionId) {
            throw new e.MissingCredentialsException();
        }
        
        return this.validate(sessionId, hash);
    }

    validate(sessionId, hash) {
        if (!hash) {
            throw new e.InvalidCredentialsException();
        }
        return this.checkSession(sessionId, hash);
    }

    authentication(req, res, next) {
        this.passport.authenticate(this.name, this.options, (error, user) => {
            if (error) {
                return this.error(req, res, error, next);
            }
            return this.logIn(req, res, user, next);
        })(req, res, next);
    }

    error(req, res, error) {
        res.status(401).send({
            status: 401,
            errors: [error.message]
        });
    }

    checkSession(sessionId, token) {
        let params = {
            params: {
                id: sessionId
            }
        };
        if (typeof token != 'undefined') {
            params.params.hash = token;
        }

        return this.services.bort.get('sessions', params).then(r => {
            if (r.status !== 200) {
                logger.error(r);
                throw new e.InvalidCredentialsException();
            }
            return r.data;
        });
    }

    logIn(req, res, user, next) {
        let token = !!req.session.lastToken ? req.session.lastToken : false;
        let sessionId = req.session.sessionId;

        new Promise((resolve, reject) => {
            if (!!token) {
                return resolve(token);
            }
            if (typeof sessionId != 'undefined') {
                return this.checkSession(sessionId).then(data => {
                    return resolve(data.sessions[0].token);
                });
            }
        }).then(token => {
            if (!token) {
                throw new e.InvalidCredentialsException();
            }

            res.setHeader('x-token', crypt.encrypt(`${user.id}|||${(new Date).getTime()}`, token));

            req.logIn(user, this.options, () => {
                next();
            });

            return true;
        }).catch(error => {
            logger.error(error);
            throw new e.InvalidCredentialsException();
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
        return {};
    }

}

module.exports = Hash;
