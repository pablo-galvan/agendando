'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import ArrowIcon from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import FakeAppBar from '../../components/FakeAppBar';
import AppBar from '../../components/AppBar';
import ErrorDialog from '../../components/ErrorDialog';
import SelectFieldRounded from '../../components/SelectFieldRounded';
import TextFieldRounded from '../../components/TextFieldRounded';
import DatePickerRounded from '../../components/DatePickerRounded';
import FlatButtonFixed from '../../components/FlatButtonFixed';

import { registerUser, logout, cleanRegister } from '../../actions';

import injectSheet from 'react-jss';
import Prefixer from 'inline-style-prefixer';

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: '#ff3e8d',
        primary2Color: '#d63368',
        accent1Color: '#9c1271'
    },
    appBar: {
        color: '#ff3e8d',
    }
});

const fields = [
    {
        name: 'name',
        placeholder: 'Nombre',
        type: 'text'
    },
    {
        name: 'surname',
        placeholder: 'Apellido',
        type: 'text',
    },
    {
        name: 'birth_date',
        placeholder: 'Cumpleaños',
        type: 'date',
    },
    {
        name: 'gender',
        placeholder: 'Sexo',
        type: 'select',
        menuOptions: [
            {
                option: 'm',
                label: 'Masculino'
            },
            {
                option: 'f',
                label: 'Femenino'
            }
        ]
    },
    {
        name: 'mail',
        placeholder: 'Email',
        type: 'email'
    },
    {
        name: 're-mail',
        placeholder: 'Repetir email',
        type: 'email'
    },
    {
        name: 'password',
        placeholder: 'Contraseña',
        type: 'password'
    },
    {
        name: 're-password',
        placeholder: 'Repetir contraseña',
        type: 'password'
    }
];

class SignupForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        fields.map(field => this.state[field.name] = '');

        mixpanel.track(`Enter register`);

        this.onChangeField = this.onChangeField.bind(this);
        this.handlerSubmit = this.handlerSubmit.bind(this);
    }

    onChangeField(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    getCurrentDate() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        return `${year}-${month.toString().length === 1 ? ('0' + month) : month}-${day}`;
    }

    handlerSubmit(e) {
        e.preventDefault();

        if (Object.keys(this.state).filter(field => this.state[field] == '').length > 0) {
            mixpanel.track(`ERROR: register empty`);
            return this.props.toggleErrorDialog('Por favor, complete todos los campos');
        }

        if (new Date(this.state['birth_date']).getTime() >= new Date(this.getCurrentDate()).getTime()) {
            mixpanel.track(`ERROR: invalid birthday`);
            return this.props.toggleErrorDialog('La fecha de nacimiento es inválida');
        }

        if (this.state['mail'] != this.state['re-mail']) {
            mixpanel.track(`ERROR: emails dont match`);
            return this.props.toggleErrorDialog('Los emails no coinciden');
        }

        if (this.state['password'] != this.state['re-password']) {
            mixpanel.track(`ERROR: password dont match`);
            return this.props.toggleErrorDialog('Las contraseñas no coinciden');
        }

        mixpanel.track(`Register send`, {
            email: this.state.mail
        });
        this.props.dispatch(registerUser(this.state));
    }

    componentDidUpdate() {
        if (this.props.error !== null && typeof this.props.error === 'object') {
            this.props.toggleErrorDialog(this.props.error.message);
            this.props.dispatch(cleanRegister());
            return;
        }
    }

    render() {
        const { styles } = this.props;
        return (
            <form style={styles.form}>
                {fields.map((field, k) => {
                    if (field.type !== 'select' && field.type !== 'date') {
                        return (
                            <TextFieldRounded
                                key={k}
                                value={this.state[field.name]}
                                onChange={this.onChangeField}
                                {...field}
                            />
                        );
                    }
                    if (field.type == 'date') {
                        return (
                            <DatePickerRounded
                                key={k} 
                                value={this.state[field.name]}
                                onChange={this.onChangeField}
                                {...field}
                            />
                        ); 
                    }
                    if (field.type == 'select') {
                        return (
                            <SelectFieldRounded
                                key={k}
                                value={this.state[field.name]}
                                onChange={this.onChangeField}
                                {...field}
                            />
                        ); 
                    }
                })}
                <FlatButtonFixed label="Registrate!" onClick={this.handlerSubmit} />
            </form>
        );
    }
};

@connect(store => {
    return {
        user: store.data.user,
        error: store.data.error,
        token: store.data.jwt
    };
})
class Signup extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            error: false,
            dialog: ''
        };

        this.props.dispatch(logout());
        this.toggleErrorDialog = this.toggleErrorDialog.bind(this);
        this.onBack = this.onBack.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!!nextProps.user && !!nextProps.user.token && !!nextProps.token) {
            if (!!localStorage) {
                localStorage.setItem('token', nextProps.token);
            }
            browserHistory.push('/');
        }
    }

    onBack(e) {
        e.preventDefault();
        this.props.router.goBack();
    }

    toggleErrorDialog(dialog) {
        this.setState({
            error: true,
            dialog: dialog
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <ErrorDialog
                        dialog={this.state.dialog}
                        open={this.state.error}
                        closeHandler={() => this.setState({ error: false })}
                    />
                    <FakeAppBar />
                    <AppBar
                        title="Registrate con tu email"
                        onLeftIconButtonTouchTap={this.onBack}
                        goToBack={true}
                    />
                    <div style={styles.container}>
                        <SignupForm styles={styles} toggleErrorDialog={this.toggleErrorDialog} {...this.props} />
                    </div>
                </div>
            </MuiThemeProvider>
        );
    }
}

const styles = new Prefixer().prefix({
    container: {
        position: 'relative',
        width: '80%',
        margin: '0 auto'
    },

    form: {
        padding: '3% 0 0',
        margin: '0 auto',
        width: '100%',
        position: 'relative'
    }
});

export default injectSheet(styles)(Signup);