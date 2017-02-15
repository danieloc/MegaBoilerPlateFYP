import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router';
import {setWidth, setHeight} from './actions/viewPortActions';
import configureStore from './store/configureStore';
import getRoutes from './routes';

const store = configureStore(window.INITIAL_STATE);

store.dispatch(setWidth(window.innerWidth));
store.dispatch(setHeight(window.innerHeight));
window.addEventListener('resize', () => {
    store.dispatch(setWidth(window.innerWidth));
    store.dispatch(setHeight(window.innerHeight));
});
ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={getRoutes(store)}/>
  </Provider>,
  document.getElementById('app')
);
