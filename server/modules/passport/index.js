'use strict';

let passport = require('passport');
let strategies = require('./strategies');
let async = require('async');

class Passport {
    constructor() {
        this.strategies = {};

        async.each(strategies, (Strategy, name) => {
            if (Strategy.enabled) {
                let strategy = new Strategy(passport);

                passport.use(strategy);
                this.strategies[Strategy.name] = strategy.middleware;
            }
        });
    }
}

module.exports = new Passport();
