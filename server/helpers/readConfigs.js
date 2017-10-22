'use strict';

let readDirFiles = require('read-dir-files');
let winston = require('winston');

class ReadConfigs {
    constructor(path) {
        this.path = path;
        this.read = readDirFiles.read;
    }

    readDir() {
        this.read(this.path, (err, files) => {
            if (err) return console.dir(err);
            return files;
        });
    }
}

module.exports = ReadConfigs;