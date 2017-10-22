'use strict';

let async = require('async');
let config = require('../config');
let mongoose = require('mongoose');
let promise = require('bluebird');
let logger = require('./logger');

class Model {
    constructor(model, schema, callback) {
        this.mongoose = mongoose;
        this.mongoose.Promise = promise;
        this.model = model;
        this.schema = schema;

        this.callback = callback;

        async.series([
            this.connect.bind(this),
            this.createSchema.bind(this),
            this.createModel.bind(this)
        ], (error, done) => {
            if (!!error) {
                this.onError(error);
            }
            this.callback();
        });
    }

    connect(done) {
        this.mongoose.connect(config.get('modules').mongodb.host, (err) => {
            if (err) {
                done(err, null)
            }
            else {
                done(null, true);
            }
        });
    }

    createSchema(done) {
        this.mongoose.schema = new this.mongoose.Schema(this.schema);
        return done(null, true);
    }

    createModel(done) {
        this.Model = this.mongoose.model(this.model, this.mongoose.schema);
        return done(null, true);
    }

    onError(err) {
        logger.error(`Error Mongo connect: ${err}`);
        return this.close();
    }

    close() {
        return this.mongoose.connection.close();
    }
}

module.exports = Model;
