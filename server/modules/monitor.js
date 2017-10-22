'use strict';

let _ = require('underscore');
let config = require('../config');
let graphite = require('./graphite');
let services = require('../services');

const CORE_VERSION = '0.0';

class Monitor {
    constructor() {
        _.each(services, this.service, this);
    }

    health() {
        let memory = process.memoryUsage();
        let time = process.hrtime();

        setImmediate(() => {
            let diff = process.hrtime(time);

            graphite.timing(['eventloop', 'latency'], diff[0] * 1e9 + diff[1]);
        });
        graphite.timing(['memory', 'rss'], memory.rss);
        graphite.timing(['memory', 'heapTotal'], memory.heapTotal);
    }

    hit(req, res) {
        let hasTime = req._startAt && req._startAt[0] && res._startAt && res._startAt[0];
        let time = hasTime ? (res._startAt[0] - req._startAt[0]) * 1e3 + (res._startAt[1] - req._startAt[1]) * 1e-6 : 0;
        let size = res.get('Content-Length') || 0;
        let metric = ['hit', req.route.path, req.method, res.statusCode];

        graphite.timing(metric, time.toFixed());
        graphite.timing(metric.concat('size'), size);
    }

    files(req, res) {
        if (!req.form) {
            return;
        }

        let length = Object.keys(req.form.files).length;

        if (!length) {
            return;
        }
        graphite.increment(['file', req.method, res.statusCode].concat(this.version(req)), length);
    }

    service(service) {
        service.on('request', this.request.bind(this, service.constructor.name));
        service.on('error', this.error.bind(this, service.constructor.name));
    }

    error(service, request) {
        graphite.timing(['error', service, request.url, request.method, request.status], request.code);
    }

    request(service, request) {
        graphite.timing(['request', service, request.url, request.method, request.status], request.time);
        graphite.timing(['request', service, request.url, request.method, request.status, 'size'], request.size);
    }
}

module.exports = new Monitor();
