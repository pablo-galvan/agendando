'use strict';

import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import reducer from "./reducers";

import promiseMiddleware from './middleware/promiseMiddleware';

let middlewares = [promise(), thunk, promiseMiddleware];

if (process.env.NODE_ENV !== `production`) {
    // middlewares.push(createLogger());
}

export default createStore(reducer, applyMiddleware(...middlewares));
