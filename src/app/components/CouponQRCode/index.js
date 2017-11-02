'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import s from './CouponQRCode.css';

class CouponQRCode extends React.Component {
    static propTypes = {
        code: PropTypes.string.isRequired,
        textSms: PropTypes.string.isRequired
    }

    render() {
        const { code, textSms } = this.props;
        return (
            <div className={s.root}>
                <p className={s.text} dangerouslySetInnerHTML={{ __html: textSms }}></p>
                <QRCode value={code} />
                <span className={s.code} dangerouslySetInnerHTML={{ __html: code }}></span>
            </div>
        );
    }
}

export default CouponQRCode;