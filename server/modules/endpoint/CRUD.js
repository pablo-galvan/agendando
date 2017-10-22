'use strict';

let _ = require('underscore');
let config = require('../../config');
let db = require('../mongoDb');
let Endpoint = require('../endpoint');
let logger = require('../logger');
let ObjectId = require('mongodb').ObjectId;
let Promise = require('bluebird');

class CRUD extends Endpoint {

    simplifyResponse(req, res, result) {
        this.send(req, res,  {
            status: 200,
            data: {
                [this.name]: result
            }
        });
    }

    mongoError(res, err) {
        err.type = err.name;
        err.response = {
            status: 500,
            data: err
        };
        err.data = err;
        this.error(res, err);
    }

    handlerGet(req, res) {
        // Reviso si existe el parametro o si no esta vacio y lo elimino para reutilizar el objeto
        let relations = !_.isEmpty(req.query['withRelations']) || req.query.hasOwnProperty('withRelations');
        delete req.query['withRelations'];

        if (!_.isEmpty(req.query['_id'])) {
            // Para la consulta a mongodb se necesita convertir el id en ObjectId
            req.query['_id'] = new ObjectId(req.query['_id']);
        }

        db.get().collection(this.name).find(req.query).toArray().then(results => {
            if (!relations) {
                return this.simplifyResponse(req, res,  results);
            }
            // Mando a buscar un nivel de relaciones
            this.findRelations(results).then(relateds => {
                return this.simplifyResponse(req, res, relateds);
            }).catch(err => {
                logger.error('ERROR :: CRUD l50 :: ${err}');
                return this.mongoError(res, err);
            });
        }).catch(err => {
            logger.error('ERROR :: CRUD l54 :: ${err}');
            return this.mongoError(res, err);
        });
    }

    handlerPost(req, res) {
        _.each(req.body[this.name], (val, key) => {
            _.each(val, (v, k) => {
                if (k == '_id') {
                    req.body[this.name][key][k] = new ObjectId(v);
                }
            });
        });

        db.get().collection(this.name).insert(req.body[this.name]).then(result => {
            return this.simplifyResponse(req, res,  result);
        }).catch(err => {
            return this.mongoError(res, err);
        });
    }

    handlerPut(req, res) {
        db.get().collection(this.name).findOneAndUpdate(
            { _id: new ObjectId(req.params.id)}, 
            { $set: req.body[this.name] },
            { returnNewDocument: false }
        ).then(result => {
            return this.simplifyResponse(req, res,  result);
        }).catch(err => {
            return this.mongoError(res, err);
        });
    }

    handlerDel(req, res) {
        db.get().collection(this.name).deleteOne({ _id: new ObjectId(req.params.id) }, {}).then(result => {
            return this.simplifyResponse(req, res,  result);
        }).catch(err => {
            return this.mongoError(res, err);
        })
    }

    handlerHealth(req, res, next) {
        if (!!db.get()) {
            return db.get().admin().serverStatus().then(info => {
                return this.send(req, res,  {
                    status: 200,
                    data: {
                        name: config.get('app').name,
                        memory: process.memoryUsage(),
                        status: {
                            dependencie: 'mongo',
                            status: {
                                uptime: info.uptime,
                                connectios: info.connections,
                                memory: info.mem,
                                lastError: info.metrics.getLastError,
                                operationsCounter: info.opcounters
                            }
                        }
                    }
                });
            }).catch(err => {
                logger.error(err);
                return this.send(req, res,  {
                    status: 500,
                    data: {
                        name: config.get('app').name,
                        memory: process.memoryUsage(),
                        status: {
                            dependencie: 'mongo',
                            status: 'down'
                        }
                    }
                });
            });
        }
        return this.send(req, res,  {
            status: 500,
            data: {
                name: config.get('app').name,
                memory: process.memoryUsage(),
                status: {
                    dependencie: 'mongo',
                    status: 'down'
                }
            }
        });
    }

    findRelations(results) {
        // Promesa que maneja multiples promesas
        return Promise.each(results, result => {
            let keys = Object.keys(result);

            return Promise.map(keys, v => {
                let fieldArray = v.split('_');

                if (_.isEmpty(fieldArray[0])) {
                    return result[v];
                }

                if (fieldArray[1] == 'id') {
                    let ids = _.isArray(result[v]) ? result[v] : [result[v]];
                    // Tengo un array con ids en formato string, los paso a ObjectId
                    ids = ids.map(id => {
                        return new ObjectId(id);
                    });
                    // Busco en la collección con un array de ids
                    return db.get().collection(fieldArray[0]).find({
                        _id: { $in: ids }
                    }).toArray().then(res => {
                        // Incluyo los objetos dentro del objeto con toda la información
                        result[fieldArray[0]] = res;
                        return result;
                    }).catch(e => {
                        logger.error(e);
                    });
                }
            }).then(results => {
                // Cuando se resuelven las promesas que son mapeadas, filtro la información
                return _.filter(results, data => {
                    return _.isObject(data) && !ObjectId.isValid(data);
                });
            });
        });
    }
}

module.exports = CRUD;