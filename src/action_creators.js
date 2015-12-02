import { createAction, handleAction, handleActions } from 'redux-actions';

export function addItem(state, item, index) {
  return {
    type: 'ADD_ITEM',
    item,
    index
  };
}

export function removeItem(state, item) {
  return {
    type: 'REMOVE_ITEM',
    item
  };
}
