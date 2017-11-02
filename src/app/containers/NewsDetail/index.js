'use strict';

import _ from 'underscore';
import React from 'react';
import { connect } from 'react-redux';

import HeaderImage from '../../components/HeaderImage';

import { getNews } from '../../actions';

import injectSheet from 'react-jss';
import Prefixer from 'inline-style-prefixer';

@connect((store) => {
    return {
        news: store.data.news
    };
})
class NewsDetail extends React.Component {
    constructor(props) {
        super(props);

        let id = Number(props.routeParams.id);
        let detail = _.filter(props.news, _.matcher({ id }))[0];

        if (_.isUndefined(detail)) {
            props.dispatch(getNews());
        }

        this.state = { detail };
    }

    componentWillReceiveProps(nextProps) {
        if (_.isUndefined(this.state.detail)) {
            this.setState({
                detail: _.filter(nextProps.news, _.matcher({ id: Number(this.props.routeParams.id) }))[0]
            });
        }
    }

    render() {

        if (typeof this.state.detail === 'undefined') {
            return null;
        }

        return (
            <div>
                <HeaderImage mainImage={this.state.detail.image} />
                <div style={styles.textWrapper}>
                    <h2 style={styles.title}>{this.state.detail.title}</h2>
                    <p style={styles.description}>{this.state.detail.description}</p>
                </div>
            </div>
        ); 
    }
}

const styles = new Prefixer().prefix({
    textWrapper: {
        padding: '20px 15px',
        textAlign: 'center'
    },

    title: {
        fontSize: '15px',
        fontWeight: '500',
        textTransform: 'uppercase',
        color: '#323232',
        margin: '1em 0'
    },

    description: {
        fontSize: '13px',
        color: '#424242',
        margin: '1em 0'
    },
});

export default injectSheet(styles)(NewsDetail);