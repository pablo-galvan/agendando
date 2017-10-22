'use strict';

module.exports = {
    enabled: false,
	host: 'mongodb://127.0.0.1/surma',
    base: 'surma',
    session: {
    	ttl: 1000 * 60 * 60 * 15
    }
};