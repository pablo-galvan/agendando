'use strict';

import _ from 'underscore';
import request from 'axios';

const HOST = "/api";

if (typeof Android !== 'undefined') {
    localStorage.setItem('token', Android.get('token'));
}

let tracking = (string, object, id) => {
    if (typeof mixpanel !== 'undefined') {
        if (!!string) {
            mixpanel.track(string);
        }
        if (!!id) {
            mixpanel.identify(id);
        }
        if (!!object) {
            mixpanel.people.set(object);
        }
    }
};

export function offLine() {
    return {
        type: 'OFFLINE'
    };
}

export function onLine() {
    return {
        type: 'ONLINE'
    };
}

export function isLogged() {
    return {
        type: typeof localStorage !== 'undefined' && _.isEmpty(localStorage.getItem('token')) ? 'USER_NOT_LOGGED' : 'USER_LOGGED'
    };
}

export function login(data) {
    return (dispatch) => {
        request.post(`${HOST}/v1/login/email`, { 
            mail: data.email,
            password: data.password,
            os: 'android',
            fingerprint: 'finger1',
            device_token: typeof Android === 'undefined' ? 'noToken' : Android.getFirebaseToken()
        })
        .then((res) => {
            tracking(false, false, res.data.data.token);
            tracking(false, {
                "$email": data.email
            }, false);
            return dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data.data
            });
        })
        .catch((err) => {
            tracking(`ERROR: LOGIN_REJECTED: ${err}`, false, false);
            return dispatch({
                type: 'LOGIN_REJECTED',
                payload: err.response.data
            });
        });
    }
}

export function cleanLogin() {
    return {
        type: 'LOGIN_CLEANED'
    };
}

export function loginFb() {
    return (dispatch) => {
        request.post(`${HOST}/v1/login/facebook`, {
            os: 'android',
            device_token: typeof Android !== 'undefined' ? Android.getFirebaseToken() : '',
            facebook_token: typeof window !== 'undefined' ? window.config.facebook.accessToken : null,
            fingerprint: 'finger1'
        })
        .then((res) => {
            tracking(false, false, res.data.data.token);
            return dispatch({
                type: 'LOGIN_SUCCESS',
                payload: res.data.data
            });
        })
        .catch((err) => {
            tracking(`ERROR: LOGIN_REJECTED_FB: ${err}`, false, false);
            return dispatch({
                type: 'LOGIN_REJECTED',
                payload: err
            });
        });
    }
}

export function getCupon(token, id) {
    if (_.isEmpty(token) && typeof localStorage !== 'undefined' ||
        typeof token === 'undefined' && typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token');
    }
    if (_.isEmpty(token) && typeof localStorage == 'undefined' && typeof Android !== 'undefined' ||
        typeof token === 'undefined' && typeof Android !== 'undefined') {
        token = Android.get('token');
    }

    return (dispatch) => {
        request.get(`${HOST}/v1/cupones/${id}`, {
            params: {
                token: token
            }
        })
        .then(res => {
            tracking(`FETCH_CUPON_SUCCESS: ID: ${id}`, false, false);
            dispatch({
                type: 'FETCH_CUPON_SUCCESS',
                payload: res.data
            });
        })
        .catch((err) => {
            tracking(`ERROR: fetch cupons: ID: ${id} ERROR: ${err}`, false, false);
            return dispatch({
                type: 'FETCH_CUPON_REJECTED',
                payload: err
            });
        });
    }
}

export function getCupons(token, params) {
    if (_.isEmpty(token) && typeof localStorage !== 'undefined' ||
        typeof token === 'undefined' && typeof localStorage !== 'undefined') {
        token = localStorage.getItem('token');
    }
    if (_.isEmpty(token) && typeof localStorage == 'undefined' && typeof Android !== 'undefined' ||
        typeof token === 'undefined' && typeof Android !== 'undefined') {
        token = Android.get('token');
    }

    let query = typeof params !== 'undefined' ? params : {
        token: token,
        withRestricted: true
    };

    return (dispatch) => {
        request.get(`${HOST}/v1/cupones`, { 
            params: query
        })
        .then((res) => {
            tracking(`FETCH_CUPONS_SUCCESS: Android: ${typeof Android !== 'undefined'}`, false, false);
            dispatch({
                type: 'FETCH_CUPONS_SUCCESS',
                payload: res.data
            });
        })
        .catch((err) => {
            tracking(`ERROR: fetch cupons: ${err}`, false, false);
            return dispatch({
                type: 'FETCH_CUPONS_REJECTED',
                payload: err
            });
        });
    }
}

export function requestCupon(id, token) {
    return (dispatch) => {
        request.post(`${HOST}/v1/cupones/${id}/codigo?token=${token}`)
        .then(res => {
            tracking(`REQUEST_CUPON_SUCCESS: Android: ${typeof Android !== 'undefined'} Cupon: ${id}`, false, false);
            return dispatch({
                type: 'REQUEST_CUPON_SUCCESS',
                payload: res.data.success
            });
        })
        .catch(err => {
            return dispatch({
                type: 'REQUEST_CUPON_REJECTED',
                payload: err
            });
        });
    }
}

export function getMenu() {
    return (dispatch) => {
        request.get(`${HOST}/v1/mobile/info`)
        .then((res) => {
            dispatch({
                type: 'FETCH_MENU_SUCCESS',
                payload: res.data.sections
            });
        })
        .catch((err) => {
            tracking(`ERROR: FETCH_MENU_REJECTED: ${err}`, false, false);
            return dispatch({
                type: 'FETCH_MENU_REJECTED',
                payload: err
            });
        });
    }
}

export function getMyOrders(token) {
    return (dispatch) => {
        request.get(`${HOST}/v1/orders`, {
            params: {
                token: token
            }
        })
        .then(res => {
            return dispatch({
                type: 'FETCH_ORDERS_SUCCESS',
                payload: res.data.data
            });
        })
        .catch(err => {
            tracking(`ERROR: FETCH_ORDERS_REJECTED: ${err}`);
            return dispatch({
                type: 'FETCH_ORDERS_REJECTED',
                payload: err
            });
        });
    }
}

export function getNews() {
    return (dispatch) => {
        request.get(`${HOST}/v1/news`)
        .then(res => {
            dispatch({
                type: 'FETCH_NEWS_SUCCESS',
                payload: res.data.results
            })
        })
        .catch(err => {
            dispatch({
                type: 'FETCH_NEWS_REJECTED',
                payload: err
            });
        });
    }
}

export function getFaq() {
    return (dispatch) => {
        request.get(`${HOST}/v1/faq`)
        .then(res => {
            dispatch({
                type: 'FETCH_FAQ_SUCCESS',
                payload: res.data.response
            })
        })
        .catch(err => {
            dispatch({
                type: 'FETCH_FAQ_REJECTED',
                payload: err
            });
        });
    }
}

export function registerUser(user) {
    return (dispatch) => {
        request.post(`${HOST}/v1/register`, user)
        .then(res => {
            localStorage.setItem('token', res.data.data.token);
            tracking('REGISTER_SUCCESS', {
                "$email": user.mail,
                "$first_name": user.name,
                "$last_name": user.surname
            }, false)
            return dispatch({
                type: 'REGISTER_SUCCESS',
                payload: res.data.data
            });
        })
        .catch(err => {
            return dispatch({
                type: 'REGISTER_REJECTED',
                payload: err.response.data
            });
        });
    }
}

export function fbLogin(data) {
    return (dispatch) => {
        request.post(`${HOST}/v1/login/facebook`, {
            os: 'android',
            device_token: 1111,
            facebook_token: data.authResponse.accessToken,
            fingerprint: 'finger1'
        })
        .then(res => {
            localStorage.setItem('token', res.data.data.token);
            return dispatch({
                type: 'REGISTER_FB_SUCCESS',
                payload: res.data
            });
        })
        .catch(err => {
            tracking(`ERROR: register fb rejected: ${err}`, false, false);
            return dispatch({
                type: 'REGISTER_FB_REJECTED',
                payload: err
            });
        });
    }
}

export function recoverPwd(email) {
    return (dispatch) => {
        request.post(`${HOST}/v1/users/recovery`, {
            email: email
        })
        .then((res) => {
            tracking(`RECOVER_PASSWORD_SUCCESS: ${email}`, false, false);
            return dispatch({
                type: 'RECOVER_PASSWORD_SUCCESS',
                payload: res.data
            });
        })
        .catch(err => {
            tracking(`RECOVER_PASSWORD_REJECTED: ${email}`, false, false);
            return dispatch({
                type: 'RECOVER_PASSWORD_REJECTED',
                payload: err.response.data.response.error
            });
        })
    }
}

export function cleanCodes() {
    return {
        type: 'CLEAN_REQUESTED_CODE'
    };
}

export function cleanRecoverPwd() {
    return {
        type: 'RECOVER_PASSWORD_CLEAN'
    };
}

export function cleanRegister() {
    return {
        type: 'REGISTER_CLEANED'
    };
}

export function logout() {
    return {
        type: 'LOGOUT'
    };
}