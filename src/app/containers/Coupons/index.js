'use strict';

import _ from 'underscore';
import React from 'react';
import { connect } from 'react-redux';
import { getCupons } from '../../actions';

import InfScroll from '../../components/InfScroll';
import ItemRow from '../../components/ItemRow';
import Loader from '../../components/Loader';
import FsMessage from '../../components/FsMessage';

@connect((store) => {
    return {
        cupons: store.data.cupons,
        token: store.data.jwt
    };
})
class Coupons extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lastPageLoad: 1
        };

        this.props.dispatch(getCupons(this.props.token));
        this.gimmeMore = this.gimmeMore.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            cupons: !!this.state.cupons ? _.union(this.state.cupons, nextProps.cupons.results) : nextProps.cupons.results
        });
    }

    refresh() {
        this.forceUpdate();
    }

    gimmeMore() {
        if (!!this.props.cupons.next) {
            this.setState({
                lastPageLoad: !!this.state.lastPageLoad ? this.state.lastPageLoad + 1 : 2
            });

            let params = {};

            if (!!this.props.cupons) {
                this.props.cupons.next.split('?')[1].split('&').map(v => {
                    params[v.split('=')[0]] = v.split('=')[1];
                });

                this.props.dispatch(getCupons(this.props.token, params));
            }
        }
    }

    render() {
        if (typeof this.state.cupons === 'undefined') {
            return <Loader />; 
        }

        if (this.state.cupons.length === 0) {
            return <FsMessage message="No hay cupones por el momento." />;
        }

        this.state.cupons.map((v, k) => {
            document.createElement('img').src = v['foto_thumbnail']['90x90'];
        });

        return (
            <div>
                <InfScroll
                    next={this.gimmeMore}
                    refreshFunction={this.refresh}
                    hasMore={!!this.props.cupons ? !!this.props.cupons.next : false}
                    pullDownToRefresh={true}
                >
                    {this.state.cupons.map((v, k) => {
                        return (
                            <ItemRow 
                                key={k}
                                availableAt={v['available_at']}
                                disabled={typeof v.disabled !== 'undefined' ? v.disabled : false}
                                link={`/coupons/${v.id}`}
                                title={v['nombre']}
                                microTag={v.microtag.text}
                                thumbnailImg={v['foto_thumbnail']['90x90']}
                                description={v['descripcion_breve']}
                            />
                        );
                    })}
                </InfScroll>
            </div>
        );
    }
}

export default Coupons;