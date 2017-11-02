'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import s from './TextFieldRounded.css';

class TextFieldRounded extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        placeholder: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        type: PropTypes.string,
        value: PropTypes.string,
    }

    render() {
        return (
            <div className={s.root}>
                <input 
                    name={this.props.name}
                    onChange={this.props.onChange}
                    type={this.props.type || "text"} 
                    placeholder={this.props.placeholder} 
                />
            </div>
        );
    }
}

export default TextFieldRounded;