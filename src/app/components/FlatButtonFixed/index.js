'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import s from './FlatButtonFixed.css';

class FlatButtonFixed extends React.Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        fixed: PropTypes.bool
    }

    render() {
        return (
            <div>
                <div className={s.button} onClick={this.props.onClick}>
                    <span className={s.button__label}>{this.props.label}</span>
                </div>
                <div className={s.button__fake}></div>
            </div>
        );
    }
};

export default FlatButtonFixed;