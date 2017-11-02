'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import s from './CouponInfo.css';

class CouponInfo extends React.Component {
    static propTypes = {
        thumbnail: PropTypes.string.isRequired,
        companyName: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        terms: PropTypes.string.isRequired
    }

    render() {
        const { children, thumbnail, companyName, description, terms } = this.props;
        return (
            <div className={s.container}>
                <div className={s.company}>
                    <img className={s.company__logo} src={thumbnail} alt={companyName} />
                </div>
                {children}
                <p className={s.description} dangerouslySetInnerHTML={{ __html: description }}></p>
                <p className={s.terms} dangerouslySetInnerHTML={{ __html: terms }}></p>
            </div>
        );
    }
}

export default CouponInfo;