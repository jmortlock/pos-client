import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import makeStore from './store'
import {Provider} from 'react-redux';
import App from './components/App';
import {PointOfSaleMainContainer} from './components/PointOfSaleMain';
import {createAction} from 'redux-actions';
import {types} from './core/actions';

const store = makeStore();

const TestItem1 = {
  plu:100,
  description: 'Coopers Pale Ale',
  prices: {A:1, B:2, C:3, D:6, E:9 }
};

const action = createAction(types.ADD_ITEM)( { item: TestItem1 });
store.dispatch(action);

const newAction = createAction(types.SET_NUMERIC_KEYBUFFER)( 10 );
store.dispatch(newAction);
store.dispatch(action);
store.dispatch(action);


const routes = <Route component={App}>
  <Route path="/" component={PointOfSaleMainContainer} />
</Route>

ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
