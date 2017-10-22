'use strict';

let Promise = require('bluebird');
let logger = require('../modules/logger');

class Exception extends Error {
    constructor(message, name) {
        super();
        this.message = message || 'exception';
        this.name = name || 'Exception';
    }
}

class NotImplementedException extends Exception {
    constructor(message, name) {
        super(message || 'not implemented exception', name || 'NotImplementedException');
    }
}

class CancellationException extends Promise.CancellationError {
    constructor(message, name) {
        super();
        this.message = message || 'cancellation exception';
        this.name = name || 'CancellationException';
    }
}

class RedirectionException extends CancellationException {
    constructor(message, name) {
        super(message || 'redirection exception', name || 'RedirectionException');
    }
}

class ValidationException extends CancellationException {
    constructor(message, name) {
        super(message || 'validation exception', name || 'ValidationException');
    }
}

class AuthenticationException extends ValidationException {
    constructor(message, name) {
        super(message || 'authentication exception', name || 'AuthenticationException');
    }
}

class UnnecessaryAuthenticationException extends AuthenticationException {
    constructor(message, name) {
        super(message || 'unnecessary authentication exception', name || 'UnnecessaryAuthenticationException');
    }
}

class MissingCredentialsException extends AuthenticationException {
    constructor(message, name) {
        super(message || 'missing credentials', name || 'MissingCredentialsException');
    }
}

class InvalidCredentialsException extends AuthenticationException {
    constructor(message, name) {
        super(message || 'invalid credentials', name || 'InvalidCredentialsException');
    }
}

class NotFoundException extends CancellationException {
    constructor(message, name) {
        super(message || 'not found', name || 'NotFoundException');
    }
}

class TimeoutException extends Promise.TimeoutError {
    constructor(message, name) {
        super();
        this.message = message || 'timeout exception';
        this.name = name || 'TimeoutException';
    }
}

function log(e) {
    if (e instanceof Error) {
        e = e.stack;
    }
    logger.error(e);
}

module.exports = {
    Exception: Exception,
    NotImplementedException: NotImplementedException,
    CancellationException: CancellationException,
    RedirectionException: RedirectionException,
    ValidationException: ValidationException,
    AuthenticationException: AuthenticationException,
    UnnecessaryAuthenticationException: UnnecessaryAuthenticationException,
    MissingCredentialsException: MissingCredentialsException,
    InvalidCredentialsException: InvalidCredentialsException,
    NotFoundException: NotFoundException,
    TimeoutException: TimeoutException,
    log: log
};
