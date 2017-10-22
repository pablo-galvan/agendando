'use strict';

let _ = require('underscore');
let cluster = require('cluster');
let config = require('../config');
let logger = require('./logger');

const COUNT = require('os').cpus().length || config.get('modules').cluster.workers || 1;

class Cluster {
    constructor(count) {
        this.count = count || COUNT;
    }

    start() {
        if (!cluster.isMaster) {
            return cluster.worker;
        }
        _.times(this.count, () => {
            cluster.fork();
        });
        cluster.on('exit', worker => {
            logger.info(`id:${worker.id} pid:${process.pid} exiting`);
            cluster.fork();
        });
    }

}

module.exports = Cluster;
