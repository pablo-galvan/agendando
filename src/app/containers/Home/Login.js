'use strict';

import React from 'react';
import { Link } from 'react-router';
import TextFieldRounded from '../../components/TextFieldRounded';
import FlatButtonFixed from '../../components/FlatButtonFixed';
import { connect } from 'react-redux';
import { login, cleanLogin } from '../../actions';
import s from './Home.css';

const form = [
    {
        name: 'email',
        type: 'email',
        placeholder: 'Email'
    },
    {
        name: 'password',
        type: 'password',
        placeholder: 'Contraseña'
    }
];

@connect((store) => {
    return {
        logged: store.data.logged,
        rejected: store.data.rejected
    };
})
class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        
        form.map(input => this.state[input.name] = '');

        this.onChangeField = this.onChangeField.bind(this);
        this.handlerSubmit = this.handlerSubmit.bind(this);
    }

    onChangeField(e) {
        e.preventDefault();

        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handlerSubmit(e) {
        e.preventDefault();
        this.props.toggleLoader();

        if (Object.keys(this.state).filter(field => this.state[field] == '').length > 0) {
            return this.props.openErrorDialog('Por favor, complete todos los campos');
        };

        return this.props.dispatch(login(this.state));
    }

    componentDidUpdate() {
        if (this.props.rejected && Object.keys(this.props.rejected).length > 0) {
            this.props.openErrorDialog(this.props.rejected.message);
            this.props.dispatch(cleanLogin());
        }
    }

    render() {
        return (
            <div>
                {form.map((input, k) => {
                    return (
                        <TextFieldRounded
                            key={k}
                            value={this.state[input.name]}
                            placeholder={input.placeholder}
                            type={input.type}
                            name={input.name}
                            onChange={this.onChangeField}
                        />
                    );
                })}
                <div className={s.login__text} onClick={this.props.togglePwRecovery}>
                    ¿Olvidaste tu contraseña?
                </div>
                <FlatButtonFixed label="Iniciar sesión"onClick={this.handlerSubmit} />
            </div>
        );
    }
}

export default Login;