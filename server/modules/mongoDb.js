'use strict';

let config = require('../config');
let logger = require('./logger');
let MongoClient = require('mongodb').MongoClient;
let Promise = require('bluebird');

const HOST = config.get('modules').mongodb.host;
const BASE = config.get('modules').mongodb.base;

class MongoDb {
    constructor() {
        this.mongo = MongoClient;
        this.host = HOST;
        this.base = BASE;
        this.state = {
            db: null
        };

        process.on('SIGINT', () => { this.close(); });
        process.on('SIGTERM', () => { this.close(); });
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.mongo.connect(`${this.host}/${this.base}`).then(db => {
                this.state.db = db;
                return resolve(db);
            }).catch(err => {
                return reject(err);
            });
        });
    }

    get() {
        return this.state.db;
    }

    close() {
        if (this.state.db) {
            return this.state.db.close((err, result) => {
                this.state.db = null;
                logger.info('MongoDb default connection disconnected through app termination');
                return result;
            });
        }
    }
}

module.exports = new MongoDb();
