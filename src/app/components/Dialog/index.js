'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Overlay from '../Overlay';
import s from './Dialog.css';

class Dialog extends React.Component {
    static PropTypes = {
        closeHandler: PropTypes.func.isRequired,
        open: PropTypes.bool.isRequired
    }

    render() {
        return (
            <Overlay {...this.props}>
                <div className={classNames({ [s.dialog]: true, [s.dialog__active]: this.props.open })}>
                    <div className={s.dialog__content}>
                        {this.props.children}
                    </div>
                    <div onClick={this.props.closeHandler} className={s.dialog__action}>
                        <button className={s.action__button}>Aceptar</button>
                    </div>
                </div>
            </Overlay>
        );
    }
}