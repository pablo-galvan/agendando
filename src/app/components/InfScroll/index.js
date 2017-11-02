'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from 'material-ui/CircularProgress';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import injectSheet from 'react-jss';
import Prefixer from 'inline-style-prefixer';

class RefreshLoader extends React.Component {
    render() {
        const { styles } = this.props;
        return (
            <div style={styles.refreshContainer}>
                <RefreshIndicator
                    percentage={30}
                    size={40}
                    left={10}
                    top={0}
                    status={this.props.status}
                    style={styles.refresh}
                />
            </div>
        );
    }
}

class InfScroll extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <InfiniteScroll
                style={styles.root}
                next={this.props.next}
                refreshFunction={this.props.refreshFunction}
                hasMore={this.props.hasMore}
                pullDownToRefresh={true}
                endMessage={<span></span>}
                loader={<span></span>}
                pullDownToRefreshThreshold={120}
                pullDownToRefreshContent={<RefreshLoader styles={styles} status="ready" />}
                releaseToRefreshContent={<RefreshLoader styles={styles} status="loading" />}
            >
                {this.props.children}
            </InfiniteScroll>
        );
    }
}

InfScroll.propTypes = {
    pullDownToRefresh: PropTypes.bool.isRequired,
    next: PropTypes.func.isRequired,
    refreshFunction: PropTypes.func
};

const styles = new Prefixer().prefix({

    root: {
        width: '100%',
        maxWidth: '100%',
        display: 'block'
    },

    refreshContainer: {
        padding: '0 0 20px',
        textAlign: 'center'
    },

    refresh: {
        position: 'initial',
        left: 'auto',
        right: 'auto',
        top: 'auto',
        bottom: 'auto',
        display: 'block',
        margin: '0 auto',
        transform: 'initial'
    }
});

export default injectSheet(styles)(InfScroll);