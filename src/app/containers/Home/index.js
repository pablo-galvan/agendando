'use strict';

import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';

import Login from './Login';
import Actions from './Actions';
import PwRecovery from './PwRecovery';

import Spinner from '../../components/Spinner';
import ErrorDialog from '../../components/ErrorDialog';
import FakeAppBar from '../../components/FakeAppBar/';
import AppBar from '../../components/AppBar/';

import s from './Home.css';

class HomeLayout extends React.Component {
    render() {
        const { loading, children } = this.props;
        return (
            <div className={s.root}>
                <div className={s.container}>
                    {children.props.viewTitle && <FakeAppBar />}
                    {children.props.viewTitle && (
                        <AppBar
                            isFixed={true}
                            goToBack={true}
                            title={children.props.viewTitle}
                            onLeftIconButtonTouchTap={children.props.viewToggle}
                        />    
                    )}
                    <div className={s.logo}>
                        <img alt="Más Outlet | Soleil" src="/static/images/logo.png" />
                    </div>
                    {loading ? <Spinner light /> : null}
                    <div style={{ display: loading ? 'none' : 'block' }}>{children}</div>
                </div>
            </div>
        );
    }
}

@connect(store => {
    return {
        facebookError: store.data.facebookError,
        facebook: store.data.facebook,
        offline: store.data.offline
    };
})
class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            dialog: '',
            toPwRecovery: false,
            toLogin: false,
            fbLogin: false
        };

        this.toggleLoader = this.toggleLoader.bind(this);
        this.openErrorDialog = this.openErrorDialog.bind(this);
        this.toggleLogin = this.toggleLogin.bind(this);
        this.toggleFb = this.toggleFb.bind(this);
        this.togglePwRecovery = this.togglePwRecovery.bind(this);
    }

    togglePwRecovery(e) {
        e.preventDefault();
        if (!navigator.onLine) {
            return this.setState({
                loading: false,
                error: true,
                dialog: 'Sin conexión a internet'
            });
        }

        this.setState({
            loading: false,
            toPwRecovery: !this.state.toPwRecovery,
            toLogin: !this.state.toLogin
        });

    }

    toggleLogin(e) {
        e.preventDefault();

        if (!navigator.onLine) {
            return this.setState({
                loading: false,
                error: true,
                dialog: 'Sin conexión a internet'
            });
        }

        this.setState({
            loading: false,
            toLogin: !this.state.toLogin
        });

    }

    toggleFb(e) {
        e.preventDefault();

        this.setState({
            loading: false,
            fbLogin: !this.state.fbLogin
        });

        if (!navigator.onLine) {
            return this.setState({
                loading: false,
                error: true,
                dialog: 'Sin conexión a internet'
            });
        }

        window.location.href =  `https://www.facebook.com/v2.9/dialog/oauth?client_id=${window.config.facebook.appId}&redirect_uri=${window.config.facebook.redirectUrl}&scope=public_profile,email,user_birthday`;
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.facebookError) {
            nextProps.router.push({
                pathname: '/register',
                query: nextProps.facebookError.response.data.error.detail
            });
        }
        if (!!nextProps.facebook) {
            nextProps.router.push({
                pathname: '/'
            });
        }
    }

    toggleLoader() {
        this.setState({
            loading: !this.state.loading
        }); 
    }

    openErrorDialog(dialog) {
        this.setState({
            loading: false,
            error: true,
            dialog: dialog
        });
    }

    renderHomeView() {
        if (this.state.toLogin) {
            return (
                <Login 
                    toggleLoader={this.toggleLoader}
                    viewTitle="Iniciar sesión" 
                    viewToggle={this.toggleLogin}
                    togglePwRecovery={this.togglePwRecovery}
                    openErrorDialog={this.openErrorDialog}
                />
            );
        };

        if (this.state.toPwRecovery) {
            return (
                <PwRecovery 
                    toggleLoader={this.toggleLoader}
                    viewTitle="Recuperar contraseña" 
                    viewToggle={this.togglePwRecovery} 
                    openErrorDialog={this.openErrorDialog}
                />
            );
        };

        return (
            <Actions 
                toggleLoader={this.toggleLoader}
                viewTitle={false} 
                toggleFb={this.toggleFb} 
                toggleLogin={this.toggleLogin} 
                openErrorDialog={this.openErrorDialog}
            />
        );
    }

    render() {
        return (
            <div>
                <ErrorDialog
                    dialog={this.state.dialog}
                    open={this.state.error}
                    closeHandler={() => this.setState({ error: false })}
                />
                <HomeLayout loading={this.state.loading}>
                    {this.renderHomeView()}
                </HomeLayout>
            </div>
        );
    }
}

export default Home;