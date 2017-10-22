'use strict';

let Base = require('../modules/middleware');
let config = require('../config')
let stringToBool = require('../helpers/convert').stringToBool;

const ENABLED = config.get('modules').middlewares.queryParser.enabled;

class QueryParser extends Base {

    static get isEnabled() {
        return ENABLED;
    }

    static get weight() {
        return 8;
    }

    handle(req, res) {
        _.each(req.query, (v, k) => {
            if (_.isString(v) && k == 'enabled') {
                return Object.assign(req.query, { [k]: stringToBool(v) });
            }
            return Object.assign(req.query, { [k]: v });
        });

        return req.query;
    }

}

module.exports = QueryParser;

