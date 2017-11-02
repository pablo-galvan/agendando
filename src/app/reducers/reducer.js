'use strict';

let initialState = typeof window != 'undefined' ? window.__PRELOADED_STATE__.data : {
    data: [],
    fetching: false,
    fetched: false,
    error: null
};

// if (!!initialState.jwt) {
//     localStorage.setItem('token', initialState.jwt);
// }

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'USER_NOT_LOGGED': {
            return { ...state, logged: false }
        }
        case 'USER_LOGGED': {
            return { ...state, logged: true }
        }
        case 'LOGIN_SUCCESS': {
            localStorage.setItem('token', action.payload.token);

            if (typeof Android !== 'undefined') {
                Android.save('token', action.payload.token);
            }

            return { ...state, logged: true, jwt: action.payload.token };
        }
        case 'LOGIN_REJECTED': {
            return { ...state, logged: false, rejected: action.payload.response.error };
        }
        case 'LOGIN_CLEANED': {
            return { ...state, logged: false, rejected: null }
        }
        case 'FETCH_CUPONS_SUCCESS': {
            localStorage.setItem('cupons', action.payload);
            return { ...state, cupons: action.payload}
        }
        case 'FETCH_CUPONS_REJECTED': {
            return { ...state, cupons: [] }   
        }
        case 'FETCH_MENU_SUCCESS': {
            return { ...state, menu: action.payload }
        }
        case 'FETCH_CUPON_SUCCESS': {
            return { ...state, cupon: action.payload }
        }
        case 'REQUEST_CUPON_SUCCESS': {
            return { ...state, requested: action.payload }
        }
        case 'CLEAN_REQUESTED_CODE' : {
            return { ...state, requested: undefined }
        }
        case 'FETCH_ORDERS_SUCCESS': {
            return { ...state, orders: action.payload }
        }
        case 'FETCH_NEWS_SUCCESS': {
            return { ...state, news: action.payload }
        }
        case 'FETCH_FAQ_SUCCESS': {
            return { ...state, faq: action.payload }
        }
        case 'REGISTER_SUCCESS': {
            return { ...state, user: action.payload, jwt: action.payload.token, logged: true }
        }
        case 'REGISTER_REJECTED': {
            return { ...state, error: action.payload.response.error }
        }
        case 'REGISTER_CLEANED': {
            return { ...state, user: null, error: null } 
        }
        case 'REGISTER_FB_SUCCESS': {
            return { ...state, facebook: action.payload }
        }
        case 'REGISTER_FB_REJECTED': {
            return { ...state, facebookError: action.payload }
        }
        case 'RECOVER_PASSWORD_SUCCESS': {
            return { ...state, recoverPwd: action.payload }
        }
        case 'RECOVER_PASSWORD_REJECTED': {
            return { ...state, recoverPwdError: action.payload }
        }
        case "RECOVER_PASSWORD_CLEAN": {
            return { ...state, recoverPwd: false, recoverPwdError: false  };
        }
        case 'LOGOUT': {
            localStorage.removeItem('token');
            if (typeof Android !== 'undefined') {
                Android.save('token', null);
            }
            if (typeof window !== 'undefined') {
                window.config.facebook.accessToken = '';
            }
            return { ...state, logged: false, jwt: null }
        }
        case 'OFFLINE': {
            return { ...state, offline: true, online: false }
        }
        case 'ONLINE': {
            return { ...state, offline: false, online: true }
        }
    }

    return state;
}

export default reducer;
