'use strict';

let logger = require('../../logger');
let service = require('../../service');
let Strategy = require('passport-local').Strategy;

let options = {
    usernameField: 'username',
    passwordField: 'password'
};

class Local extends Strategy {
    constructor(passport) {
        super(options, (username, password, callback) => {
            return this.verify(username, password, callback);
        });
        this.passport = passport;
        this.initialize();
        this.service = service;
    }

    get name() {
        return 'local';
    }

    static get enabled() {
        return false;
    }

    initialize() {
        this.passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        this.passport.deserializeUser((id, done) => {
            this.service.bort.get('una-url-valida', {
                params: {
                    id: id
                }
            }).then(user => {
                done(null, user);
            });
        });
    }

    verify(username, password, done) {
        let passHash = crypt.encryptPass(password);

        this.service.bort.get('una-url-valida', { 
            params: {
                username: username
            }
        }).then(user => {
            if (crypt.comparePass(password, user.password)) {
                return done(null, user);
            }
            return done(null, false, {
                message: 'Invalid user data'
            });
        }).catch(err => {
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
                    message: info.message
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

module.exports = Local;
