'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import s from './DatePickerRounded.css';

class DatePickerRounded extends React.Component {
    static propTypes = {
        type: PropTypes.string,
        value: PropTypes.string,
        name: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        onChange: PropTypes.func
    }

    render() {
        return (
            <div className={s.selector}>
                <span className={classNames({ [s.label]: true, [s.label__active]: this.props.value !== '' })}>
                    {this.props.value !== '' ? this.props.value : 'Cumpleaños'}
                </span>
                <input style={{ color: 'rgba(0,0,0,0)' }} {...this.props} />
                <i className={s.selector__arrow + " fa fa-angle-down"} aria-hidden="true"></i>
            </div>
        );
    }
}

export default DatePickerRounded;