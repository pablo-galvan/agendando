'use strict';

let stringToBool = (val) => {
    return (val + '').toLowerCase() === 'true';
};


module.exports = {
    stringToBool: stringToBool
};