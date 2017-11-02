'use strict';

import React from 'react';

class Iframe extends React.Component {
    render() {
        return <iframe style={{ width: '100%', height: '100%' }} src={ this.props.url }></iframe>;
    }
}

export default Iframe;