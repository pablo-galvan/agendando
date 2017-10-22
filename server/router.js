'use strict';

let Routes = require('./modules/routes');

class Router {
    constructor(api) {
        this.api = api;
        this.setRoutes();
    }

    setRoutes() {
        return new Routes(this.api);
    }
}

module.exports = Router;
