'use strict';

import React from 'react';
import { connect } from 'react-redux';
import TextFieldRounded from '../../components/TextFieldRounded';
import FlatButtonFixed from '../../components/FlatButtonFixed';
import { recoverPwd, cleanRecoverPwd } from '../../actions';
import s from './Home.css';

@connect((store) => {
    return {
        success: store.data.recoverPwd,
        error: store.data.recoverPwdError
    };
})
class PwRecovery extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            'mail': ''
        };

        this.onSubmit = this.onSubmit.bind(this); 
        this.onChangeField = this.onChangeField.bind(this); 
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.toggleLoader();

        if (Object.keys(this.state).filter(field => this.state[field] == '').length > 0) {
            this.props.openErrorDialog('Por favor, complete todos los campos');
            return; 
        }

        if (!this.validateEmail(this.state.mail)) {
            this.props.openErrorDialog('El email es inválido');
            return;
        }

        this.props.dispatch(recoverPwd(this.state.mail));
    }

    onChangeField(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    componentDidUpdate() {
        if (this.props.error !== null && typeof this.props.error === 'object') {
            this.props.openErrorDialog(this.props.error.message);
            this.props.dispatch(cleanRecoverPwd());
        }
        
        if (!!this.props.success) {
            this.props.openErrorDialog('Revise su correo electrónico y siga los pasos para reestablecer su contraseña. Si continua teniendo incovenientes, comuníquese a <a href="mailto:soleil@cupona.com">soleil@cupona.com</a>.');
            this.props.dispatch(cleanRecoverPwd());
        }
    }

    render() {
        return (
            <div>
                <p className={s.login__text}>Podemos ayudarte a recuperar o cambiar tu contraseña. Ingresá tu email y seguí los pasos.</p>
                <form>
                    <TextFieldRounded
                        name="mail"
                        placeholder="Email"
                        type="email"
                        value={this.state['mail']}
                        onChange={this.onChangeField}
                    />
                    <FlatButtonFixed 
                        label="Continuar" 
                        onClick={this.onSubmit}
                    />
                </form>
            </div>
        );
    }
}

export default PwRecovery;