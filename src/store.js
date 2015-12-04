import {createStore, applyMiddleware, combineReducers} from 'redux';
import {webPos} from './reducer';
import {Map} from 'immutable';

//import promiseMiddleware from 'redux-promise';
//import promiseMiddleware from 'redux-promise-middleware';
import { apiMiddleware } from 'redux-api-middleware';

const createStoreWithMiddleware = applyMiddleware(apiMiddleware)(createStore);

export default function makeStore() {
  return createStoreWithMiddleware(webPos, Map());
}
