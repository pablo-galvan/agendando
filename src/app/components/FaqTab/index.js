'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import s from './FaqTab.css';

class FaqTab extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            toggled: true,
            more: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.setState({
            toggled: !this.state.toggled,
        });
    }

    componentDidMount() {
        if (this.refs['tab-desc'].offsetHeight > 40) {
            this.setState({
                toggled: false,
                more: true
            });
        }
    }

    render() {
        return (
            <div className={s.tab} onClick={this.handleClick}>
                <h4 className={s.title}>
                    {this.props.title}
                </h4>
                <p ref="tab-desc" className={s.description} style={{
                    display: this.state.toggled ? 'block' : '-webkit-box',
                    WebkitLineClamp: this.state.toggled ? 'none' : '2',
                    maxHeight: this.state.toggled ? 'none' : '40px'
                }}>
                    {this.props.description}
                </p>
                {this.state.more && <button className={s.toggler}>{this.state.toggled ? 'Ver menos' : 'Ver más'}</button>}
            </div>
        );
    }
}

export default FaqTab;