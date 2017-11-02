'use strict';

import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../../actions';
import classNames from 'classnames';

import Overlay from '../Overlay';
import s from './Drawer.css';

@connect()
class Drawer extends React.Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(e) {
        e.preventDefault();
        this.props.dispatch(logout());
    }

    render() {
        const { open, closeHandler, menu, location } = this.props;
        return (
            <Overlay {...this.props}>
                <div className={classNames({ [s.drawer]: true, [s.drawer__hidden]: !open })}>
                    <div className={s.drawer__container}>
                        <div className={s.logo}>
                            <img className={s.logo__img} src="/static/images/logo.png" alt="Más Outlet | Soleil" />
                        </div>
                        <ul className={s.menu}>
                            {typeof menu !== 'undefined' ? menu.map((v, k) => {
                                let url = v.type !== 'native' ? '/web' : `/${v.target.toLowerCase()}`;

                                return (
                                    <li className={s.menu__item} key={k}>
                                        <Link 
                                            className={classNames({ 
                                                [s.item]: true, 
                                                [s.item__active]: location.pathname == url}
                                            )} 
                                            to={url}
                                            onClick={() => {
                                                if (v.type !== 'native') {
                                                    localStorage.setItem('webUrl', v.target.toLowerCase());
                                                }
                                            }}
                                        >
                                            <i className="fa" dangerouslySetInnerHTML={{ __html: v.icon }}></i>
                                            <span dangerouslySetInnerHTML={{ __html: v.title }}></span>
                                        </Link>
                                    </li>
                                );
                            }) : null}
                        </ul>
                        <div className={s.btn}>
                            <button className={s.btn__logout} onClick={this.logout}>
                                <span>Cerrar sesión</span>
                            </button>
                        </div>
                    </div>
                </div>
            </Overlay>
        );
    }
};

export default Drawer;