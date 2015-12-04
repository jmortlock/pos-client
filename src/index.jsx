import React from 'react';
import ReactDOM from 'react-dom';
import Router, {Route} from 'react-router';
import makeStore from './store'
import {Provider} from 'react-redux';
import App from './components/App';
import {PointOfSaleMainContainer} from './components/PointOfSaleMain';
import {createAction} from 'redux-actions';
import {types} from './core/actions';
import {PriceLevelResetEnum, PriceLevelEnum} from '../src/core/price_level_enum';

const store = makeStore();

const TestItem1 = {
  plu:100,
  description: 'Coopers Pale Ale',
  prices: {A:1, B:2, C:3, D:6, E:9 }
};

const NavPage = {
  rows: [
    {
      cols: [
        {type:5, text: "Mains"},
        {type:5, text: "Entrees"},
        {type:5, text: "Desert"},
        {type:5, text: "BEER / Wine"},
        {type:5, text: "Bookings"},
        {type:5, text: "Setup"},
      ]
    }
  ]
};

const GridPage = {
  page: 'This is the page name',
  rows: [
    {
      cols: [
        {type: 0, text: 'Add Item'},
        {type: 1, text: 'Remove Item'},
        {type: 0, text: 'Add Item'},
        {type: 0, text: 'Add Item'},
        {type: 0, text: 'Add Item'},
        {type: 0, text: 'Add Item'},
        ]
      },
      {
        cols: [
          {type: 2, text: '1', payload: 1},
          {type: 2, text: '2', payload: 2},
          {type: 2, text: '3', payload: 3},
          {type: 3, text: 'Price Level A', payload: {  toPriceLevel: PriceLevelEnum.A, resetOn: PriceLevelResetEnum.NEVER  }},
          {type: 3, text: 'Price Level B', payload: {  toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.NEVER  }},
          {type: 3, text: 'Price Level C', payload: {  toPriceLevel: PriceLevelEnum.C, resetOn: PriceLevelResetEnum.NEVER  }},
          ]
      },
      {
      cols: [
        {type: 2, text: '4', payload: 4},
        {type: 2, text: '5', payload: 5},
        {type: 2, text: '6', payload: 6},
        {type: 3, text: 'Price Level D', payload: {  toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.NEVER  }},
        {type: 3, text: 'Price Level E', payload: {  toPriceLevel: PriceLevelEnum.E, resetOn: PriceLevelResetEnum.NEVER  }},
        {type: 0, text: 'Add Item'},
        ]
      },
      {
      cols: [
        {type: 2, text: '7', payload: 7},
        {type: 2, text: '8', payload: 8},
        {type: 2, text: '9', payload: 9},
        {type: 0, text: 'Add Item'},
        {type: 0, text: 'Add Item'},
        {type: 4, text: 'Complete Sale'},
        ]
      }
    ]
};


store.dispatch(createAction("SET_CURRENT_GRID_PAGE")(GridPage));
store.dispatch(createAction("SET_CURRENT_NAV_PAGE")(NavPage));

const routes = <Route component={App}>
  <Route path="/" component={PointOfSaleMainContainer} />
</Route>

ReactDOM.render(
  <Provider store={store}>
    <Router>{routes}</Router>
  </Provider>,
  document.getElementById('app')
);
