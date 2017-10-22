'use strict';

let _ = require('underscore');
let async = require('async');
let bodyParser = require('body-parser');
let Cluster = require('./modules/cluster');
let compression = require('compression');
let config = require('./config');
let express = require('express');
let expressSanitized = require('express-sanitized');
let expressSession = require('express-session');
let helmet = require('helmet');
let logger = require('./modules/logger');
let memwatch = require('./modules/memwatch');
let Middlewares = require('./middlewares');
let morgan = require('morgan');
let redis = require('redis');
let passport = require('passport');
let RedisStore = require('connect-redis')(expressSession);
let Router = require('./router');
let Swaggerize = require('./modules/swagger');

class Server {
    constructor() {
        this.app = express();
        this.api = express.Router();

        this.port = process.env.PORT || config.get('server').port;
        this.mode = process.env.MODE || 'dev';

        this.middlewares = {};
    }

    start() {
        let modules = config.get('modules');
        let steps = [
            this.configure.bind(this),
            this.middleware.bind(this)
        ];

        if (!!modules.mongodb.enabled) {
            steps.push(this.initMongo.bind(this));
        }
        if (modules.cluster.enabled) {
            steps.push(this.clusterize.bind(this));
        }
        if (modules.swagger.enabled) {
            steps.push(this.swaggerize.bind(this));
        }

        steps.push(
            this.init.bind(this),
            this.routing.bind(this)
        );

        async.series(steps);
    }

    configure(done) {
        this.app.disable('x-powered-by');

        this.app.use('/api', this.api);

        this.api.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });

        if (this.mode != 'test') {
            this.api.use(morgan(config.get('morgan').mode));
            this.app.use(morgan(config.get('morgan').mode));
        }

        this.api.use(bodyParser.urlencoded({ extended: true }));
        this.api.use(bodyParser.json());
        this.app.use(expressSanitized());
        this.app.use(expressSession({
            secret: config.get('server').secret,
            resave: true,
            saveUninitialized: true,
            store: new RedisStore({
                host: config.get('modules').cache.redis.host,
                port: config.get('modules').cache.redis.port,
                client: redis.createClient(),
                disableTTL: true
            }),
            name: 'pwa.sid'
        }));
        this.api.use(passport.initialize());
        this.api.use(passport.session());

        this.api.use(compression());
        this.app.use(compression());
        this.api.use(helmet());
        this.app.use(helmet());

        if (config.get('app').memwatch.enabled) {
            memwatch.onStats();
        }

        done(null);
    }

    clusterize(done) {
        this.cluster = new Cluster();
        this.worker = this.cluster.start();

        if (this.worker) {
            this.instances = {
                id: this.worker.id,
                process: process.pid
            };
            return done();
        }
    }

    routing(done) {
        this.router = new Router(this.api);

        if (config.get('app').ssr) {
            let FrontEnd = require('../frontend');
            this.frontend = new FrontEnd(this.app);
        }

        return done();
    }

    middleware(done) {
        _.each(_.sortBy(Middlewares, 'weight'), Middleware => {
            if (!Middleware.isEnabled) {
                return;
            }
            this.middlewares[Middleware.id] = new Middleware();
            this.api.use(this.middlewares[Middleware.id].handler.bind(this.middlewares[Middleware.id]));
        });

        done();
    }

    initMongo(done) {
        let cluster = require('cluster');

        if (cluster.isMaster) {
            return done();
        }

        let MongoDb = require('./modules/mongoDb');
        MongoDb.connect().then(res => {
            logger.info('MongoDb connect');
            return done();
        }).catch(err => {
            logger.error(err);
            return done();
        });
    }

    swaggerize(done) {
        this.api.use('/documentation', express.static('swagger/documentation'));
        this.swagger = new Swaggerize(this.api);
        this.swagger.init();

        done();
    }

    init(done) {
        this.app.listen(this.port, () => {
            let msg = this.instances ? `Server corriendo! puerto: ${this.port} instancia: ${this.instances.id} proceso: ${this.instances.process}` : 'Server corriendo!';
            logger.info(msg);
            return done();
        });
    }
}

module.exports = Server;
