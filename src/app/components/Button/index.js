'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import s from './Button.css';

class Button extends React.Component {
    static propTypes = {
        onClick: PropTypes.func.isRequired,
        label: PropTypes.string.isRequired,
        fullWidth: PropTypes.bool,
        primary: PropTypes.bool,
    }

    render() {
        const text = this.props.label;
        const buttonClass = classNames({
            [s.button]: true,
            [s.button__fullwidth]: this.props.fullWidth,
            [s.button__primary]: !this.props.secondary && !this.props.accent && !this.props.alternative ? this.props.primary : false,
            [s.button__secondary]: this.props.secondary,
            [s.button__accent]: this.props.accent,
            [s.button__alternative]: this.props.alternative,
        });

        return (
            <button className={buttonClass} onClick={this.props.onClick}>
                <span className={s.button__label}>{text}</span>
            </button>
        );
    }
}

Button.defaultProps = {
    fullWidth: false,
    primary: true,
    secondary: false,
    accent: false,
    alternative: false
};

export default Button;