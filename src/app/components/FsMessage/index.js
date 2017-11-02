'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import s from './FsMessage.css';

class FsMessage extends React.Component {
    static propTypes = {
        message: PropTypes.string.isRequired,
        warning: PropTypes.bool,
    }

    render() {
        return (
            <div className={s.root}>
                <div className={s.message}>
                    {this.props.warning && <i className={s.message__icon + " fa fa-exclamation-circle"} aria-hidden="true"></i>}
                    <span className={s.message__text}>{this.props.message}</span>
                </div>
            </div>
        );
    }
}

FsMessage.defaultProps = {
    warning: false
};

export default FsMessage;