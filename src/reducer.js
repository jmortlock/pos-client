import {List, Map, fromJS} from 'immutable';
import {addItem, removeItem, setPriceLevel, resetPriceLevel, completeSale} from './reducers/transaction_reducer';
import {setNumericKeyBuffer, appendNumericKeyBuffer} from './reducers/numeric_buffer_reducer';


export default function(state = Map(), action) {
  switch(action.type) {
    case 'ADD_ITEM':
      return addItem(state, action.item, action.index);
    case 'REMOVE_ITEM':
      return removeItem(state, action.item, action.index);
    case 'RESET_PRICE_LEVEL':
      return resetPriceLevel(state);
    case 'SET_PRICE_LEVEL':
      return setPriceLevel(state, action.priceLevel);
    case 'SET_NUMERIC_KEYBUFFER':
      return setNumericKeyBuffer(state, action.value);
    case 'APPEND_NUMERIC_KEYBUFFER':
      return appendNumericKeyBuffer(state, action.value);
    case 'COMPLETE_SALE':
      return completeSale(state);
  }
  return state;
};
