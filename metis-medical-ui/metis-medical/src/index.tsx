import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import './bootstrap/css/bootstrap-theme.min.css';
import './bootstrap/css/bootstrap.min.css';
import './index.css';
import './react-vis/style.css';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/store';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();
