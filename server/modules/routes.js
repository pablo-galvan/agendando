'use strict';

let async = require('async');
let fs = require('fs');

class Routes {
    constructor(api) {
        this.api = api;
        this.route = [];

        async.series([
            this.readFiles.bind(this),
            this.registerRoutes.bind(this)
        ]);
    }

    readFiles(done) {
        this.dir = `${process.cwd()}/endpoints`;

        fs.readdirSync(this.dir)
            .forEach((file) => {
                this.route.push(`${this.dir}/${file}`);
            });
        done();
    }

    registerRoutes() {
        this.route.forEach((value) => {
            let Route = require(value);

            return Route.isEnabled() ? new Route(this.api) : false;
        })
    }
}

module.exports = Routes;