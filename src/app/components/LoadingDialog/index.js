'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Spinner from '../Spinner';
import Overlay from '../Overlay';
import s from './LoadingDialog.css';

class LoadingDialog extends React.Component {
    static propTypes = {
        message: PropTypes.string.isRequired,
        open: PropTypes.bool.isRequired
    }

    render() {
        const { open, message } = this.props;
        return (
            <Overlay {...this.props}>
                <div className={classNames({ [s.dialog]: true, [s.dialog__active]: open })}>
                    <Spinner width={40} height={40} />
                    <span className={s.message}>{message}</span>
                </div>
            </Overlay>
        );
    }
}

export default LoadingDialog;