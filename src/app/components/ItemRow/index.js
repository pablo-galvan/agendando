'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames';
import s from './ItemRow.css';

class ItemRow extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        thumbnailImg: PropTypes.string.isRequired,
        microTag: PropTypes.string,
        disabled: PropTypes.bool,
        link: PropTypes.string
    }

    render() {
        const { link, disabled, orderedAt, microTag, thumbnailImg, title, description } = this.props;
        return (
            <Link className={classNames({ [s.root]: true, [s.disabled]: disabled })} to={this.props.link}>
                <div className={s.row}>
                    <div className={s.avatar}>
                        {typeof microTag !== 'undefined' ? <div className={s.avatar__microtag}>{microTag}</div> : null}
                        <div className={s.thumb}>
                            <img className={s.thumb__img} src={thumbnailImg} alt={title} />
                        </div>
                    </div>
                    <div className={s.info}>
                        <h2 dangerouslySetInnerHTML={{ __html: title }} className={s.h2}></h2>
                        <p dangerouslySetInnerHTML={{ __html: description }} className={s.description}></p>
                        {orderedAt ?
                            <div className={s.history}>
                                <div className={s.history__date}>
                                    <i className={`${s.history__icon} fa fa-calendar`} aria-hidden="true"></i>
                                    <span>{orderedAt.split(' ')[0]}</span>
                                </div>
                                <div>
                                    <i className={`${s.history__icon} fa fa-clock-o`} aria-hidden="true"></i>
                                    <span>{orderedAt.split(' ')[1]}</span>
                                </div>
                            </div>
                        :
                            <button className={s.btn}>
                                <span className={s.btn__label}>Ver más</span>
                            </button> 
                        }
                    </div>
                </div>
            </Link>
        );
    }
}

ItemRow.defaultProps = {
    disabled: false,
    openErrorDialog: () => null
};

export default ItemRow;