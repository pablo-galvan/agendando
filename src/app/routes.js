'use strict';

import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Main from './containers/Main';
import Coupons from './containers/Coupons';
import Coupon from './containers/Coupon';
import News from './containers/News';
import NewsDetail from './containers/NewsDetail';
import History from './containers/History';
import HistoryCoupon from './containers/HistoryCoupon';
import Signup from './containers/Signup';
import Faq from './containers/Faq';
import Web from './containers/Web';

class NotFound extends React.Component {
    render() {
        browserHistory.push('/');
        return null;
    }
}

const routes = (
    <Router history={browserHistory}>
        <Route path='/' component={Main}>
            <IndexRoute component={Coupons} pageName="Beneficios" />
            <Route path="/coupons" component={Coupons} pageName="Beneficios" />
            <Route path="/coupons/:id" component={Coupon} pageName="Beneficios" goToBack={true} backPath="/coupons" />
            <Route path="/news" component={News} pageName="Novedades" />
            <Route path="/news/:id" component={NewsDetail} pageName="Novedades" goToBack={true} backPath="/news" />
            <Route path="/history" component={History} pageName="Historial" />
            <Route path="/history/:id" component={HistoryCoupon} pageName="Historial" goToBack={true} backPath="/history" />
            <Route path="/faq" component={Faq} pageName="Preguntas Frecuentes" />
            <Route path="/web" component={Web} pageName="" />
        </Route>
        <Route path="/signup" component={Signup} pageName="Registro" />
        <Route path="*" component={NotFound} />
    </Router>
);

export default routes;
