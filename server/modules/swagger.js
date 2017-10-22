'use strict';

let config = require('../config');
let fs = require('fs');
let swagger = require('jsdoc-express-with-swagger');

class Swaggerize {
    constructor(api) {
        this.api = api;
        this.swagger = swagger;
        this.prepareOptions();
    }

    get isEnabled() {
        return config.get('modules').swagger.enabled;
    }

    prepareOptions() {
        this.options = config.get('modules').swagger;
        this.options.apiFiles = [];

        fs.readdirSync(process.cwd() + this.options.routes)
          .forEach((file) => {
                if (file !== 'index.js') {
                    this.options.apiFiles.push(`.${this.options.routes}/${file}`);
                }
            });
    }

    init() {
        this.swagger.init(this.api, this.options);
    }
}

module.exports = Swaggerize;