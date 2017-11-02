'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import s from './HeaderImage.css';

class HeaderImage extends React.Component {
    static propTypes = {
        mainImage: PropTypes.string,
        microtag: PropTypes.string
    }
    
    render() {
        return (
            <div className={s.root} style={{ backgroundImage: `url(${this.props.mainImage})` }}>
                <div className={s.overlay}></div>
                {typeof this.props.microtag !== 'undefined' && <span className={s.microtag}>{this.props.microtag}</span>}
            </div>
        );
    }
}

export default HeaderImage;