'use strict';

require('css-modules-require-hook')({
    generateScopedName: '[hash:base64:5]',
    prepend: [
        require('autoprefixer')()
    ]
});
require('babel-register')({
  'plugins': [
        ['babel-plugin-transform-object-rest-spread'],
        ['babel-plugin-syntax-object-rest-spread'],
        ['transform-decorators-legacy'],
        ['babel-plugin-transform-require-ignore', {}]
    ]
});
require("babel-core").transform("code", {
    plugins: [
        "transform-decorators-legacy",
        "transform-class-properties",
        "syntax-object-rest-spread"
    ]
});

let _ = require('underscore');
let config = require('../server/config');
let createStore = require('redux').createStore;
let express = require('express');
let exphbs  = require('express-handlebars');
let history = require('connect-history-api-fallback');
let logger = require('../server/modules/logger');
let Promise = require('bluebird');
let React = require('react');
let reactRouter = require('react-router');
let reactRedux = require('react-redux');
let Redis = require('../server/modules/redis');
let renderToString = require('react-dom/server').renderToString;
let path = require('path');
let Services = require('../server/services');
let time = require('../server/helpers/time');

let routes = require('../src/app/routes').default;
let store = require('../src/app/store').default;

let Provider = reactRedux.Provider;
let match = reactRouter.match;
let RouterContext = reactRouter.RouterContext;

class Frontend {
    constructor(app) {
        this.app = app;
        this.app.engine('.html', exphbs({extname: '.html'}));
        this.app.set('view engine', '.html');
        this.app.set('views',`${__dirname}/views`);
        this.app.use(history());

        this.mode = process.env.MODE || 'dev';
        this.store = store;
        this.errors = [];
        this.services = Services;

        this.cacheServer = new Redis();

        this.routes();
    }

    routes() {
        this.app.use('/static', express.static('public/static/'));
        this.app.get('/sw.js', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public', 'sw.js'));
        });
        this.app.get('/sw-handler.js', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public', 'sw-handler.js'));
        });
        this.app.get('/manifest.json', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public', 'manifest.json'));
        });
        this.app.get('/modernizr-bundle.js', (req, res) => {
            res.sendFile(path.resolve(__dirname, '../public', 'modernizr-bundle.js'));
        });

        this.app.get('/index.html', this.handlerSSR.bind(this));
    }

    handlerSSR(req, res, next) {
        if (req.url === '/index.html') {
            req.url = '/';
        }

        new Promise((resolve, reject) => {
            if (_.isEmpty(req.query.code)) {
                return resolve();
            }
            let fbConfig = config.get('modules').services.facebook;
            let code = req.query.code;

            req.query.code = "";

            this.services.facebook.get('/v2.9/oauth/access_token', {
                params: {
                    'client_id': fbConfig.appId,
                    'redirect_uri': fbConfig['redirect_uri'],
                    'client_secret': fbConfig.secret,
                    code: code
                }
            }).then(r => {
                return resolve(r.data['access_token']);
            }).catch(e => {
                logger.error(e);
            });
        }).then((accessToken) => {
            match(
                { routes: routes, location: req.url },
                (err, redirectLocation, renderProps) => {
                    let markup;

                    if (err) {
                        return res.status(500).send(err.message);
                    }
                    if (redirectLocation) {
                        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
                    }
                    if (renderProps) {
                        markup = renderToString(React.createElement(
                            Provider, 
                            { store:  this.store }, 
                            React.createElement(RouterContext, renderProps))
                        );
                    }
                    else {
                        // markup = TODO: crear pagina para 404
                        return res.status(404);
                    }

                    return res.render('index.html', {
                        body: markup,
                        reduxState: JSON.stringify(this.store.getState()),
                        config: JSON.stringify({
                            facebook: {
                                accessToken: accessToken,
                                appId: config.get('modules').services.facebook.appId,
                                redirectUrl: config.get('modules').services.facebook['redirect_uri']
                            }
                        })
                    });
                }
            );
        });

    }

    cache(duration) {
        duration = duration || this.defaultCache;
        let toTime = time.toMilliseconds(duration);
        let seconds = time.toMilliseconds(duration) / 1000;
        let mtime = new Date();
        let moduleCache = config.get('modules').cache;

        if (moduleCache.enabled) {
            if (moduleCache.redis.enabled) {
                return this.cacheServer.route({
                    expire: {
                        200: seconds,
                        '4xx': moduleCache.redis.expire['4xx'],
                        '5xx': moduleCache.redis.expire['5xx'],
                        'xxx': 0
                    }
                });
            } else {
                return (req, res, next) => {
                    next();
                };
            }
        }
    }
}

module.exports = Frontend;