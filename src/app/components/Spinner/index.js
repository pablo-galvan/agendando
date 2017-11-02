'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import s from './Spinner.css';

class Spinner extends React.Component {
    static propTypes = {
        light: PropTypes.bool,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
    }
    render() {
        const { width, height } = this.props;
        return (
            <div 
                className={classNames({ [s.spinner]: true, [s.spinner__light]: this.props.light })} 
                style={{ width: `${width}px`, height: `${height}px`}}
            >
            </div>
        );
    }
}

Spinner.defaultProps = {
    width: 48,
    height: 48,
    light: false,
}

export default Spinner;