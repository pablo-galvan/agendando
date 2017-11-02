'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import FsMessage from '../FsMessage';
import Spinner from '../Spinner';
import s from './Loader.css';

class Loader extends React.Component {
    render() {
        if (typeof window !== 'undefined' && !navigator.onLine) {
            return (
                <FsMessage warning message="No estás conectado a internet, vuelva a intentarlo." />
            );
        }

        return (
            <div className={s.root}>
                <Spinner width={48} height={48} />
            </div>
        );
    }
}

export default Loader;