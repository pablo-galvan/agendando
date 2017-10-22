'use strict';

let logger = require('../../logger');
let services = require('../../../services');
let Strategy = require('passport-local').Strategy;

let options = {
    usernameField: 'email',
    passwordField: 'password'
};

class Login extends Strategy {
    constructor(passport) {
        super(options, (email, password, callback) => {
            return this.verify(email, password, callback);
        });
        this.passport = passport;
        this.initialize();
        this.services = services;
    }

    get name() {
        return 'local';
    }

    static get enabled() {
        return true;
    }

    initialize() {
        this.passport.serializeUser((user, done) => {
            done(null, user);
        });

        this.passport.deserializeUser((user, done) => {
            this.services.bort.get(`administrators/${user.id}`, {}).then(user => {
                done(null, user.data.administrator);
            }).catch(e => {
                done(null, null);
            });
        });
    }

    verify(email, password, done) {
        this.services.bort.get(`administrators`, {
            params: { email, password }
        }).then(user => {
            if (!!user.status && user.status != 401) {
                return done(null, user.data.administrators[0]);
            }

            if (user.status == 401) {
                return done(null, false, { message: user.data.response.error });
            }

            return done(null, false, { message: user.response.statusText || 'error' });
        }).catch(err => {
            logger.error(`Error Authenticate :: ${err}`);
            return done(null, false, {
                message: err
            });
        });
    }

    authentication(req, res, next) {
        this.passport.authenticate(this.name, (err, user, info) => {
            if (err) {
                return this.error(req, res, err);
            }
            if (!user) {
                return this.error(req, res, {
                    message: !!info ? info.message : 'No info Error'
                });
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

    logIn(req, res, user, next) {
        req.logIn(user, (err) => {
            if (err) {
                logger.error(err);
            }
            next();
        });
    }

    get middleware() {
        return this.authentication.bind(this);
    }

    get options() {
        return {};
    }
}

module.exports = Login;
