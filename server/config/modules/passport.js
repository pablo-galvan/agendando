'use strict';

module.exports = {
    token: '$2a$10$1Jo9smx41FbqrRT7hHdCWeWxRbWgc6d6c3NWKNK/MiNf0qNlIsp/y',
    strategies: {
        token: {
            ttl: 2592000000,
            options: {
                session: false
            },
            credentials: {
                user: {
                    location: 'session',
                    name: 'user'
                },
                token: {
                    location: 'query',
                    name: 'token'
                }
            }
        },
        hash: {
            credentials: {
                hash: {
                    location: 'headers',
                    name: 'x-token'
                },
                session: {
                    location: 'session',
                    name: 'sessionId'
                }
            }
        }
    }
}