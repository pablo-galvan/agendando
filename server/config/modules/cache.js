'use strict';

module.exports = {
	enabled: true,
	http: {
		enabled: false
	},
	redis: {
		enabled: !!process.env.REDIS ? true : false,
		host: !!process.env.REDIS ? process.env.REDIS.host : '127.0.0.1',
		port:!!process.env.REDIS ? process.env.REDIS.port : '6379',
        expire: {
            '4xx': 5,
            '5xx': 5
        }
	}
}