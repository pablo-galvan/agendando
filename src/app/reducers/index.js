'use strict';

import { combineReducers } from "redux";
import { routerReducer } from 'react-router-redux';

import data from "./reducer";

export default combineReducers({
    data,
    routerReducer
});
