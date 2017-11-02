'use strict';

import React from 'react';
import { connect } from 'react-redux';

import { getMyOrders } from '../../actions';

import ItemRow from '../../components/ItemRow';
import Loader from '../../components/Loader';
import FsMessage from '../../components/FsMessage';

@connect((store) => {
    return {
        orders: store.data.orders,
        token: store.data.jwt || localStorage.getItem('token')
    }
})
class History extends React.Component {
    constructor(props) {
        super(props);

        this.props.dispatch(getMyOrders(this.props.token));
    }

    render() {
        if (typeof this.props.orders === 'undefined') {
            return <Loader />; 
        }

        if (this.props.orders.length === 0) {
            return <FsMessage message="No hay beneficios pedidos para mostrar" />;
        }

        return (
            <div>
                {this.props.orders.map((v, k) => {
                    return (
                        <ItemRow 
                            key={k}
                            link={`/history/${v.id}`}
                            orderedAt={v.ordered_at}
                            title={v.cupon['nombre']}
                            microTag={v.cupon.microtag.text}
                            thumbnailImg={v.cupon['foto_thumbnail']['90x90']}
                            description={v.cupon['descripcion_breve']}
                        />
                    ); 
                })}
            </div>
        );
    }
}

export default History;