'use strict';

let fs = require('fs');
let path = require('path');
let Promise = require('bluebird');

Promise.promisifyAll(fs);

const EXTENSION = '.js';

function requireRecursivly(dirname) {
    let files = {};

    for (let filename of fs.readdirSync(dirname)) {
        let abspath = `${dirname}/${filename}`;
        let name = path.basename(filename, EXTENSION);
        let extension = path.extname(filename);
        let isDirectory = fs.statSync(abspath).isDirectory();

        if (isDirectory) {
            files[filename] = requireRecursivly(abspath);
        }
        if (isDirectory || name === 'index' || extension !== EXTENSION) {
            continue;
        }
        files[name] = require(abspath);
    }

    return files;
}

module.exports = Object.assign({
    requireRecursivly: requireRecursivly
}, fs);
