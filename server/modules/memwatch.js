'use strict';

let config = require('../config');
let graphite = require('./graphite');
let logger = require('./logger');
let memwatch = require('memwatch-next');

class Memwatch {
    constructor() {
        this.memwatch = memwatch;

        if (config.get('app').memwatch.leakWatch) {
            this.onLeak();
        }

        setInterval(() => {
            this.memwatch.gc();
        }, config.get('app').memwatch.gc.timing);
    }

    onStats() {
        this.memwatch.on('stats', (stats) => {
            graphite.timing(['memory', 'stats', 'trend'], stats['usage_trend']);
            graphite.timing(['memory', 'stats', 'heapcompactions'], stats['heap_compactions']);
            graphite.timing(['memory', 'stats', 'estimatedbase'], stats['estimated_base']);
            graphite.timing(['memory', 'stats', 'currentbase'], stats['current_base']);
            graphite.timing(['memory', 'stats', 'min'], stats['min']);
            graphite.timing(['memory', 'stats', 'max'], stats['max']);
            graphite.timing(['memory', 'stats', 'numfullGc'], stats['num_full_gc']);
            graphite.timing(['memory', 'stats', 'numincgc'], stats['num_inc_gc']);
        });
    }

    onLeak() {
        this.memwatch.on('leak', (info) => {
            logger.error(info);
        });
    }
}

module.exports = new Memwatch();