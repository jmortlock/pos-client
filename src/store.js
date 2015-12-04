import {createStore, applyMiddleware, combineReducers} from 'redux';
import {webPos} from './reducer';
import {Map, List} from 'immutable';

//import promiseMiddleware from 'redux-promise';
//import promiseMiddleware from 'redux-promise-middleware';
import { apiMiddleware } from 'redux-api-middleware';

const createStoreWithMiddleware = applyMiddleware(apiMiddleware)(createStore);
const INITIAL_STATE = Map().set("sale_items", List());

export default function makeStore() {
  return createStoreWithMiddleware(webPos, INITIAL_STATE);
}
