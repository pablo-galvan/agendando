'use strict';

let Base = require('../modules/middleware');
let monitor = require('../modules/monitor');

class Middleware extends Base {

    static get weight() {
        return 5;
    }

    handle(req, res) {
        req.on('health', () => {
        });
        res.on('finish', () => {
            monitor.health();
            monitor.hit(req, res);
            monitor.files(req, res);
        });
    }

}

module.exports = Middleware;
