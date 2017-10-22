'use strict';

let _ = require('underscore');
let fs = require('fs');
let path = require('path');

function requiredir(dirname) {
    let files = {};

    for (let filename of fs.readdirSync(dirname)) {
        let abspath = `${dirname}/${filename}`;
        let name = path.basename(filename, '.js');
        let extension = path.extname(filename);
        let isDirectory = fs.statSync(abspath).isDirectory();

        if (isDirectory) {
            files[filename] = requiredirSync(abspath);
        }
        if (isDirectory || name === 'index' || extension !== '.js') {
            continue;
        }
        files[name] = require(abspath);
    }
    return files;
}

module.exports = _.mapObject(_.pick(requiredir(__dirname), Service => {
    return Service.enabled;
}), Service => {
    return new Service();
});
