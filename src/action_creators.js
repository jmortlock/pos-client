import {createAction} from 'redux-actions';
import {types} from './core/actions';

export function addItem(item, index) {
  return createAction(types.ADD_ITEM)({ item: item });
}

export function removeSelectedItem() {
  return createAction(types.REMOVE_SELECTED_ITEM)();
}
