'use strict';

import _ from 'underscore'; 
import React from 'react';
import { connect } from 'react-redux';

import HeaderImage from '../../components/HeaderImage';
import CouponInfo from '../../components/CouponInfo';
import CouponQRCode from '../../components/CouponQRCode';
import Loader from '../../components/Loader';

import { getMyOrders } from '../../actions';

@connect((store) => {
    return {
        orders: store.data.orders,
        token: store.data.jwt || localStorage.getItem('token')
    }
})
class HistoryCoupon extends React.Component {
    constructor(props) {
        super(props);

        if (_.isUndefined(props.orders)) {
            props.dispatch(getMyOrders(props.token));
        }

        this.state = { 
            historyCoupon: props.orders ? _.filter(props.orders, _.matcher({ id: Number(props.routeParams.id) }))[0] : undefined
        };
    }

    componentWillReceiveProps(nextProps) {
        if (_.isUndefined(this.state.historyCoupon)) {
            this.setState({
                historyCoupon: _.filter(nextProps.orders, _.matcher({ id: Number(this.props.routeParams.id) }))[0]
            });
        }
    }

    render() {
        const { historyCoupon } = this.state;

        if (typeof this.state.historyCoupon === 'undefined') {
            return <Loader />; 
        }
        return (
            <div>
                <HeaderImage 
                    mainImage={historyCoupon.cupon['foto_principal']['280x190']} 
                    microtag={historyCoupon.cupon.descuento} 
                />
                <CouponInfo
                    companyName={historyCoupon.cupon['empresa'].nombre}
                    thumbnail={historyCoupon.cupon['foto_apaisada']['240x80']}
                    description={historyCoupon.cupon['descripcion_breve']}
                    terms={historyCoupon.cupon.legales}
                >
                    <CouponQRCode code={historyCoupon.code} textSms={historyCoupon['texto_sms']} />
                </CouponInfo>
            </div>
        );
    }
}

export default HistoryCoupon;