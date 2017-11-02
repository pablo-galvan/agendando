'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import s from './Overlay.css';

class Overlay extends React.Component {
    static PropTypes = {
        open: PropTypes.bool.isRequired,
        closeHandler: PropTypes.func.isRequired,
    }
    
    render() {
        const { open, children, closeHandler } = this.props;
        return (
            <div className={classNames({ [s.root]: true, [s.root__hidden]: !open })}>
                <div className={classNames({[s.overlay]: true, [s.overlay__active]: open })} onClick={closeHandler}></div>                    
                {children}
            </div>
        );
    }

    componentDidUpdate() {
        if (typeof window !== 'undefined') {
            return this.props.open ? (document.body.style.overflowY = 'hidden') : (document.body.removeAttribute('style')); 
        }
    }
}

export default Overlay;