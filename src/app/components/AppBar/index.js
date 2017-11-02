'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import ArrowIcon from 'material-ui/svg-icons/navigation/arrow-back';
import s from './AppBar.css';

class AppBar extends React.Component {
    static propTypes = {
        title: PropTypes.string,
        onLeftIconButtonTouchTap: PropTypes.func, 
        goToBack: PropTypes.bool
    }

    render() {
        return (
            <div className={s.root}>
                <button className={s.button} onClick={this.props.onLeftIconButtonTouchTap}>
                    {this.props.goToBack ? <ArrowIcon /> : <NavigationMenu />}
                </button>
                <h1 className={s.title}>{this.props.title}</h1>
            </div>
        );
    }
};

export default AppBar;