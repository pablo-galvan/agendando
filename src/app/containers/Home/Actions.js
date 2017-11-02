'use strict';

import React from 'react';
import { browserHistory } from 'react-router';
import { fbLogin } from '../../actions';
import Button from '../../components/Button';
import s from './Home.css';

class Actions extends React.Component {
    render() {
        const { toggleFb, toggleLogin } = this.props;
        return (
            <div className={s.login__actions}>
                <Button 
                    label="Registrate con Facebook"
                    onClick={toggleFb}
                    fullWidth={true}
                />
                <Button 
                    onClick={() => {
                        if (!navigator.onLine) {
                            return this.props.openErrorDialog('Sin conexión a internet');
                        }
                        browserHistory.push('/signup');
                    }} 
                    label="Registrate con tu email"
                    fullWidth={true}
                    alternative={true}
                />
                <div className={s.login__text} onClick={toggleLogin}>
                    ¿Ya tenés cuenta? <strong>Iniciá sesión</strong>
                </div>
            </div>
        ); 
    }
}

export default Actions;