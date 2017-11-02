'use strict';

import React from 'react';

import Iframe from '../../components/Iframe';

class Web extends React.Component {
    render() {
        let url = localStorage.getItem('webUrl');

        return <Iframe url={ url } />;
    }
}

export default Web;