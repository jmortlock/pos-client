import {createAction} from 'redux-actions';
import {types} from './core/actions';

export function genericButtonPress(buttonType) {

  const TestItem1 = {
    plu:100,
    description: 'Coopers Pale Ale',
    prices: {A:1, B:2, C:3, D:6, E:9 }
  };

  return createAction(types.ADD_ITEM)({ item: TestItem1 });
}

export function addItem(item, index) {
  return createAction(types.ADD_ITEM)({ item: item });
}

export function removeSelectedItem() {
  return createAction(types.REMOVE_SELECTED_ITEM)();
}
