'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import s from './NewsCard.css';

class NewsCard extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        headerImg: PropTypes.string.isRequired,
        link: PropTypes.string
    }
    
    render() {
        return (
            <div className={s.root}>
                <Link className={s.card} to={this.props.link}>
                    <div className={s.card__image} style={{ backgroundImage: `url(${this.props.headerImg})` }}>
                        <div className={s.card__overlay}></div>
                        <h2 className={s.title} dangerouslySetInnerHTML={{ __html: this.props.title }}></h2>
                    </div>
                    <div className={s.card__bottom}>
                        <p className={s.description} dangerouslySetInnerHTML={{ __html: this.props.description }}></p>
                        <button className={s.button}>Ver más</button>
                    </div>
                </Link>
            </div>
        );
    }
}

export default NewsCard;
