import {List, Map, fromJS} from 'immutable';

export function setNumericKeyBuffer(state, value) {

  const parsedValue = parseInt(value);
  if (!isNaN(parsedValue)) {
    return state.set('numeric_key_buffer', parseInt(value));
  } else {
    return state;
  }
};

export function appendNumericKeyBuffer(state, value) {
  var currentBuffer = state.get('numeric_key_buffer');
  if (!currentBuffer)  {
    return state.set('numeric_key_buffer', parseInt(value));
  } else {
    return state.set('numeric_key_buffer', parseInt(currentBuffer.toString() + value.toString()));
  }
};
