'use strict';

let _ = require('underscore');
let fs = require('../helpers/fs');

module.exports = _.mapObject(fs.requireRecursivly(__dirname), (Middleware, id) => {
    Middleware.id = id;
    return Middleware;
});
