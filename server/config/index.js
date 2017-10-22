'use strict';

let fs = require('../helpers/fs');
let ReadConfigs = require('../helpers/readConfigs');

class Config {
    constructor(env) {
        this.env = env;
        this.configs = fs.requireRecursivly(__dirname);
    }

    get(key) {
        if (key == 'all') return this.configs;

        try {
            return this.configs[key];
        }
        catch(e) {
            console.error(e);
            return e;
        }
    }
}


module.exports = new Config();