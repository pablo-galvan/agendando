'use strict';

module.exports = {
	enabled: false,
	http: {
		enabled: false
	},
	redis: {
		enabled: false,
		host: !!process.env.REDIS ? process.env.REDIS.host : '127.0.0.1',
		port:!!process.env.REDIS ? process.env.REDIS.port : '6379',
        expire: {
            '4xx': 5,
            '5xx': 5
        }
	}
}
