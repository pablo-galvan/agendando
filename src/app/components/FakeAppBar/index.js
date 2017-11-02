'use strict';

import React from 'react';
import s from './FakeAppBar.css';

class FakeAppBar extends React.Component {
    render() {
        return (
            <div className={s.root}></div>
        );
    }
}

export default FakeAppBar;