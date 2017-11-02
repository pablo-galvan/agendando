'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '../Dialog';
import classNames from 'classnames';
import s from './SelectFieldRounded.css';

class SelectFieldRounded extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        menuOptions: PropTypes.array,
        onChange: PropTypes.func.isRequired,
        placeholder: PropTypes.string.isRequired,
        type: PropTypes.string,
        value: PropTypes.string,
    }

    render() {
        return (
            <div className={s.selector}>
                <select 
                    name={this.props.name}
                    onChange={this.props.onChange}
                    value={this.props.value}
                    style={{ color: this.props.value !== '' ? '#fff' : 'rgba(250, 250, 250, 0.8)' }}
                >
                    <option value="" disabled>{this.props.placeholder}</option>
                    {this.props.menuOptions.map((val, key) => <option key={key} value={val.option}>{val.label}</option>)}
                </select>
                <i className={s.selector__arrow + " fa fa-angle-down"} aria-hidden="true"></i>
            </div>
        );
    }
};

export default SelectFieldRounded;