'use strict';

let base64Encode = require('./base64Encode');
let crypto = require('crypto');

let encrypt = function (payload, token) {
    let iv = crypto.randomBytes(16);
    let key = new Buffer(token, 'base64');

    let cipher  = crypto.createCipheriv('aes-128-cbc', key, iv);
    let value = cipher.update(payload, 'utf8');

    value = Buffer.concat([value, cipher.final()]).toString('base64');

    let mac = crypto.createHmac('sha256', key)
            .update(iv.toString('base64') + value)
            .digest('hex');

    let json = JSON.stringify({ 
        iv: iv.toString('base64'), 
        value: value, 
        mac: mac 
    });

    return base64Encode(json);
};

module.exports = {
    encrypt: encrypt
};