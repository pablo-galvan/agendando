'use strict';

import React from 'react';
import { connect } from 'react-redux';
import Loader from '../../components/Loader';
import NewsCard from '../../components/NewsCard';
import FsMessage from '../../components/FsMessage';
import { getNews } from '../../actions';

@connect((store) => {
    return {
        news: store.data.news
    };
})
class News extends React.Component {
    constructor(props) {
        super(props);
        this.props.dispatch(getNews());
    }

    render() {
        if (typeof this.props.news === 'undefined') {
            return <Loader />; 
        }

        if (this.props.news.length === 0) {
            return <FsMessage message="Aún no hay novedades. ¡Estate atento!" />;
        }

        return (
            <div style={{
                backgroundColor: '#f4f4f4',
                padding: '15px 0',
                position: 'relative',
                minHeight: '91.5%',
            }}>
                {this.props.news.map((n, k) => {
                    return (
                        <NewsCard 
                            key={k}
                            link={`/news/${n.id}`}
                            title={n.title}
                            headerImg={n.image}
                            description={n.description}
                        />
                    );
                })}
            </div>
        );
    }
};

export default News;