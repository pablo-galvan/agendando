'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import store from './store';
import Routes from './routes';
import Background from './components/Background';

import { offLine, onLine } from './actions';

const container = document.getElementById('app');
injectTapEventPlugin();

class App extends React.Component {
    render() {
        return Routes;
    }
}
mixpanel.track(`Init`);

window.addEventListener('offline', function() {
    offLine();
});

window.addEventListener('online', function() {
    onLine();
});

ReactDOM.render(
	<Provider store={store}>
		<Background>
			<App />
		</Background>
	</Provider>, 
container);
