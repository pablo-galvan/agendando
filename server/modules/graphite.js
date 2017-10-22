'use strict';

let _ = require('underscore');
let Promise = require('bluebird');
let config = require('../config');
let logger = require('./logger');
let Client = require('node-statsd');

const CONFIG = config.get('graphite');
const IS_DISABLED = !CONFIG.enabled;
const HOSTNAME = config.get('app').name;
const PLACEHOLDER = '<<separator>>';
const TAGS_SEPARATOR = ',';
const SEPARATOR = '.';
const EXTREME = '';
const SPACE = '_';
const SLASH = '.';
const DOT = '+';

let rSeparator = new RegExp(PLACEHOLDER, 'g');
let rSlash = /\//g;
let rSpace = / /g;
let rDotsExt = /(^\.|\.$)/g;
let rDots = /\.+/g;
let rDot = /\./g;

Promise.promisifyAll(Client.prototype);

class Graphite {
    constructor() {
        this.client = new Client(_.extend(CONFIG, {
            mock: !Graphite.isEnabled
        }));

        this.PLACEHOLDER = PLACEHOLDER;
        this.SEPARATOR = SEPARATOR;
        this.SPACE = SPACE;
        this.SLASH = SLASH;
        this.DOT = DOT;
    }

    static get isEnabled() {
        return !CONFIG.mock && !IS_DISABLED;
    }

    static get isMockEnabled() {
        return CONFIG.mock && !IS_DISABLED;
    }

    timing(name, value, sampleRate, tags) {
        return this.send('timing', name, value, sampleRate, tags);
    }

    increment(name, value, sampleRate, tags) {
        return this.send('increment', name, value || 1, sampleRate, tags);
    }

    decrement(name, value, sampleRate, tags) {
        return this.send('decrement', name, value || -1, sampleRate, tags);
    }

    histogram(name, value, sampleRate, tags) {
        return this.send('histogram', name, value, sampleRate, tags);
    }

    gauge(name, value, sampleRate, tags) {
        return this.send('gauge', name, value, sampleRate, tags);
    }

    unique(name, value, sampleRate, tags) {
        return this.send('unique', name, value, sampleRate, tags);
    }

    set(name, value, sampleRate, tags) {
        return this.unique(name, value, sampleRate, tags);
    }

    send(method, metric, value, sampleRate, tags) {
        if (sampleRate && typeof sampleRate !== 'number') {
            tags = sampleRate;
            sampleRate = 1;
        }
        if (tags && !Array.isArray(tags)) {
            tags = [];
        }
        sampleRate = sampleRate || 1;
        tags = tags || [];
        metric = this.stringify(metric);
        this.mock(method, metric, value, sampleRate, tags);
        return this.client[`${method}`](metric, value, sampleRate, tags);
    }

    stringify(name) {
        let string = Array.isArray(name) ? name.join(PLACEHOLDER) : name.replace(rDot, PLACEHOLDER);

        string = string
            .replace(rSpace, SPACE)
            .replace(rDot, DOT)
            .replace(rSeparator, SEPARATOR)
            .replace(rSlash, SLASH)
            .replace(rDots, SEPARATOR)
            .replace(rDotsExt, EXTREME);
        return `${HOSTNAME}${SEPARATOR}${string}`.toLowerCase();
    }

    mock(method, metric, value, sampleRate, tags) {
        if (Graphite.isMockEnabled) {
            logger.debug(`Graphite ${method} ${metric} ${value} ${sampleRate} ${tags.join(TAGS_SEPARATOR)}`);
        }
    }
}

module.exports = new Graphite();
