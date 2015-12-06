import {List, Map, fromJS} from 'immutable';
import {addItem, removeItem,removeSelectedItem, setPriceLevel, resetPriceLevel, completeSale, setSelectedSaleItemIndex} from './reducers/transaction_reducer';
import {setNumericKeyBuffer, appendNumericKeyBuffer} from './reducers/numeric_buffer_reducer';
import {types} from '../src/core/actions';
import { createAction, handleAction, handleActions } from 'redux-actions';


const INITIAL_STATE = Map().set("sale_items", List());

export const webPos = handleActions({
  [types.SET_SELECTED_SALEITEM_INDEX]: (state, action) => {
    return setSelectedSaleItemIndex(state, action.payload);
  },
  [types.SET_NUMERIC_KEYBUFFER]: ( state, action ) => {
    return setNumericKeyBuffer(state, action.payload);
  },
  [types.APPEND_NUMERIC_KEYBUFFER]: (state, action) => {
    return appendNumericKeyBuffer(state, action.payload);
  },
  [types.ADD_ITEM]: (state, action) => {
    return addItem(state, action.payload.item, action.payload.index);
  },
  [types.REMOVE_ITEM]: (state, action) => {
    return removeItem(state, action.index);
  },
  [types.REMOVE_SELECTED_ITEM]: (state, action) => {
    return removeSelectedItem(state);
  },
  [types.RESET_PRICE_LEVEL]: (state, action) => {
    return resetPriceLevel(state);
  },
  [types.SET_PRICE_LEVEL]: (state, action) => {
    return setPriceLevel(state, action.payload);
  },
  [types.COMPLETE_SALE]: (state, action) => {
    return completeSale(state);
  },
  [types.FASTPLU]: {
    next(state, action) {
      return addItem(state, action.payload, undefined);
    },
    throw(state, action) {
      return state.set("warnings", List().push(action.payload.message));
    }
  },
  ['SET_CURRENT_GRID_PAGE']: (state, action) => {
    return state.set("current_grid_page", action.payload);
  },
  ['SET_CURRENT_NAV_PAGE']: (state, action) => {
    return state.set("current_nav_page", action.payload).set("showModal", false);
  }

}, INITIAL_STATE);
