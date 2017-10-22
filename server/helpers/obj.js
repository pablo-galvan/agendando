'use strict';

let _ = require('underscore');

function get(obj, keys, defaultValue) {
    let value;

    keys = keys || [];
    defaultValue = defaultValue || null;
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    keys.every((key, index) => {
        value = getValue(obj, value, key, index);
        return typeof value !== 'undefined';
    });
    if (typeof value === 'undefined') {
        return defaultValue;
    }
    return _.isFunction(value) ? value : _.clone(value);
}

function getValue(obj, value, key, index) {
    try {
        if (!index) {
            return obj[key];
        }
        return value[key];
    }
    catch (error) {
        return;
    }
}

module.exports = {
    get: get
};
