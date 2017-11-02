'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import s from './Container.css';

class Container extends React.Component {
    render() {
        return (
            <div className={s.root}>
                {this.props.children}
            </div>
        );
    }
}

export default Container;