import {createAction} from 'redux-actions';
import {types} from './core/actions';

export function genericButtonPress(buttonType, payload) {

  if (buttonType == 0) {
    const TestItem1 = {
      plu:100,
      description: 'Coopers Pale Ale',
      prices: {A:1, B:2, C:3, D:6, E:9 }
      };

    return createAction(types.ADD_ITEM)({ item: TestItem1 });
  } else if (buttonType == 1) {
    return createAction(types.REMOVE_SELECTED_ITEM)();
  } else if (buttonType == 2) {
    console.log(payload);
    return createAction(types.APPEND_NUMERIC_KEYBUFFER)(payload);
  } else if (buttonType == 3) {
    return createAction(types.SET_PRICE_LEVEL)(payload);
  } else if (buttonType == 4) {
    return createAction(types.COMPLETE_SALE)();
  }
}

export function addItem(item, index) {
  return createAction(types.ADD_ITEM)({ item: item });
}

export function removeSelectedItem() {
  return createAction(types.REMOVE_SELECTED_ITEM)();
}
