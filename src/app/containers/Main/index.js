
'use strict';

import _ from 'underscore';
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { login, getMenu, isLogged, loginFb } from '../../actions';

import Home from '../Home';
import FakeAppBar from '../../components/FakeAppBar/';
import AppBar from '../../components/AppBar/';
import Drawer from '../../components/Drawer/';
import Container from '../../components/Container';
import Splash from '../../components/Splash';
import Background from '../../components/Background';

import * as OfflinePluginRuntime from 'offline-plugin/runtime';

OfflinePluginRuntime.install();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#ff3e8d',
        primary2Color: '#d63368',
        accent1Color: '#9c1271'
    },
    appBar: {
        color: '#ff3e8d',
    }
});

@connect((store) => {
    return {
        logged: store.data.logged,
        menu: store.data.menu,
        token: store.data.jwt
    };
})
class Main extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            open: false,
            location: props.children.props.location.pathname
        };

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);

        this.props.dispatch(getMenu());
        this.androidStorage = typeof Android !== 'undefined' ? Android.get('token') : '';

        if ((_.isEmpty(this.props.token) || typeof this.props.token == 'undefined') && 
            (typeof window !== 'undefined' && !!window.config.facebook.accessToken)) {
            this.props.dispatch(loginFb());
            mixpanel.track("FBLogin");
            browserHistory.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.location !== nextProps.children.props.location.pathname) {
            this.setState({
                open: false,
                location: nextProps.children.props.location.pathname
            });
        }
    }

    openDrawer(e) {
        mixpanel.track("open menu");
        this.setState({ open: true });
    }

    closeDrawer(e) {
        mixpanel.track('close menu')
        this.setState({ open: false });
    }

    render() {
        let { children, logged, token } = this.props;

        if ((typeof token === 'undefined' || _.isEmpty(token)) && typeof localStorage !== 'undefined') {
            token = localStorage.getItem('token');
        }

        if (typeof window === 'undefined') {
            return <Splash />
        }

        if (typeof window === 'undefined' || typeof logged !== 'undefined' && !logged && children.props.route.pageName != 'Registro' || _.isEmpty(token)) {
            return (
                <MuiThemeProvider muiTheme={muiTheme}>
                    <Home {...this.props} />
                </MuiThemeProvider>
            );
        } else if (!!logged || !_.isEmpty(this.androidStorage) || !_.isEmpty(token)) {
            return (
                <MuiThemeProvider muiTheme={muiTheme}>
                    <main>
                        <AppBar
                            title={children.props.route.pageName}
                            goToBack={children.props.route.goToBack ? true : false}
                            onLeftIconButtonTouchTap={children.props.route.goToBack ? () => browserHistory.push(children.props.route.backPath) : this.openDrawer}
                        />
                        <Drawer
                            open={this.state.open}
                            closeHandler={this.closeDrawer}
                            {...this.props}
                        />
                        <Container>
                            <FakeAppBar />
                            {children}
                        </Container>
                    </main>
                </MuiThemeProvider>
            );
        } else {
            return <Splash />
        }
    }
};

export default Main;
