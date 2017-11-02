'use strict';

import _ from 'underscore';
import React from 'react';
import { connect } from 'react-redux';

import HeaderImage from '../../components/HeaderImage';
import CouponInfo from '../../components/CouponInfo';
import CouponQRCode from '../../components/CouponQRCode';
import LoadingDialog from '../../components/LoadingDialog';
import FlatButtonFixed from '../../components/FlatButtonFixed';
import Loader from '../../components/Loader';
import DisabledCouponMessage from '../../components/DisabledCouponMessage';

import { requestCupon, getCupons, cleanCodes, getCupon } from '../../actions';


@connect((store) => {
    return {
        cupons: store.data.cupons,
        requested: store.data.requested,
        token: store.data.jwt,
        cupon: store.data.cupon
    };
})
class Coupon extends React.Component {
    constructor(props) {
        super(props);

        if (_.isUndefined(props.cupons) || _.isUndefined(_.filter(props.cupons.results, _.matcher({ id: Number(props.routeParams.id) }))[0])) {
            props.dispatch(getCupon(props.token, props.routeParams.id));
        }

        this.state = { 
            cupon: props.cupons ? _.filter(props.cupons.results, _.matcher({ id: Number(props.routeParams.id) }))[0] : undefined,
            loaded: false,
            error: true,
        };
        
        mixpanel.track(`coupon: ${props.routeParams.id}`);
        this.handlerRequest = this.handlerRequest.bind(this);
    }

    handlerRequest(e) {
        e.preventDefault();

        this.setState({ loaded: true });
        this.props.dispatch(requestCupon(this.props.routeParams.id, this.props.token || localStorage.getItem('token')));
        mixpanel.track(`requested coupon: ${this.props.routeParams.id}`);
    }

    componentWillReceiveProps(nextProps) {
        if (_.isUndefined(this.state.cupon)) {
            this.setState({
                cupon: _.filter(nextProps.cupons.results, _.matcher({ id: Number(this.props.routeParams.id) }))[0]
            });
        }
    }

    componentWillUnmount() {
        this.props.dispatch(cleanCodes());
    }

    availableAt(availableAt) {
        const date = new Date(availableAt);
        let y = date.getFullYear(),
            m = date.getMonth() + 1,
            d = date.getDate();
        return `${y}/${m.toString().length > 1 ? m : ('0' + m)}/${d}`;
    }

    render() {
        let { cupon } = this.state;
        let { requested } = this.props;

        if (_.isEmpty(cupon)) {
            cupon = this.props.cupon;
        }

        if (!cupon || typeof cupon === 'undefined') {
            return <Loader />;
        }

        return (
            <div>
                <LoadingDialog message="Solicitando código..." open={!_.isUndefined(requested) ? false : this.state.loaded} />
                <HeaderImage 
                    mainImage={cupon['foto_principal']['280x190']} 
                    microtag={cupon.descuento} 
                />
                <CouponInfo
                    companyName={cupon['empresa'].nombre}
                    thumbnail={cupon['foto_apaisada']['240x80']}
                    description={cupon['descripcion_breve']}
                    terms={cupon.legales}
                >
                    {!_.isUndefined(requested) && <CouponQRCode code={requested.codigo} textSms={requested['texto_sms']} />}
                </CouponInfo>
                {_.isUndefined(requested) && !cupon.disabled ? <FlatButtonFixed label={"Ver código"} onClick={this.handlerRequest} /> : null}
                {cupon.disabled && <DisabledCouponMessage message={`Podrás volver a solicitar el código de descuento a partir del <strong>[ ${this.availableAt(cupon['available_at'])} ]</strong> a las <strong>[ ${cupon['available_at'].split(' ')[1]} ]</strong>.`} />}
            </div>
        ); 
    }
}

export default Coupon;