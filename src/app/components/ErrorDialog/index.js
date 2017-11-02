'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Overlay from '../Overlay';
import s from './ErrorDialog.css';

class ErrorDialog extends React.Component {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        dialog: PropTypes.string.isRequired,
        closeHandler: PropTypes.func
    }

    render() {
        const { open, dialog, closeHandler } = this.props;
        return (
            <Overlay {...this.props}>
                <div className={classNames({ [s.dialog]: true, [s.dialog__active]: open })}>
                    <div className={s.dialog__content}>
                        <span dangerouslySetInnerHTML={{ __html: this.props.dialog }}></span>
                    </div>
                    <div className={s.action}>
                        <button onClick={closeHandler} className={s.action__button}>
                            Aceptar
                        </button>
                    </div>
                </div>
            </Overlay>
        );
    }
};
export default ErrorDialog;