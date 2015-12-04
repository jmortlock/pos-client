import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import makeStore from './store'
import {Provider} from 'react-redux';
import App from './components/App';
import TransactionList from './components/TransactionList';

const store = makeStore();

const routes = <Route component={App}>
  <Route path="/" component={TransactionList} />
</Route>

ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
