import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';
import { createAction, handleAction, handleActions } from 'redux-actions';
import {types} from '../src/core/actions';
import {webPos} from '../src/reducer';

describe('numeric buffer reducer', () => {

  it('handles SET_NUMERIC_KEYBUFFER ', () => {
      const action = createAction(types.SET_NUMERIC_KEYBUFFER)(10);
      const firstState = webPos(Map(), action);
      expect(firstState).to.equal(fromJS({
            numeric_key_buffer: 10
      }));
  });

  it('handles SET_NUMERIC_KEYBUFFER with valid String parsing', () => {
    const action = createAction(types.SET_NUMERIC_KEYBUFFER)(10);

    const firstState = webPos(Map(), action);
    expect(firstState).to.equal(fromJS({
          numeric_key_buffer: 10
    }));
  });

  it('ignores invalid string values to SET_NUMERIC_KEYBUFFER', () => {
    const action = createAction(types.SET_NUMERIC_KEYBUFFER)('a10a');
    const firstState = webPos(Map(), action);
    expect(firstState).to.equal(Map());
  });

  it('handles APPEND_NUMERIC_KEYBUFFER with no initial value', () => {
    const action = createAction(types.APPEND_NUMERIC_KEYBUFFER)(1);
    const firstState = webPos(Map(), action);
    expect(firstState).to.equal(fromJS({
          numeric_key_buffer: 1
    }));
  });

  it('handles batch APPEND_NUMERIC_KEYBUFFER ', () => {
    const actions = [
        createAction(types.APPEND_NUMERIC_KEYBUFFER)(1),
        createAction(types.APPEND_NUMERIC_KEYBUFFER)(0),
        createAction(types.APPEND_NUMERIC_KEYBUFFER)(5)
    ];

    const finalState = actions.reduce(webPos, Map());

    expect(finalState).to.equal(fromJS({
          numeric_key_buffer: 105
    }));
  });

  it('handles batch APPEND_NUMERIC_KEYBUFFER ignoring invalid chars', () => {
    const actions = [
        createAction(types.APPEND_NUMERIC_KEYBUFFER)(1),
        createAction(types.APPEND_NUMERIC_KEYBUFFER)('A'),
        createAction(types.APPEND_NUMERIC_KEYBUFFER)(5)
    ];
    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
          numeric_key_buffer: 15
    }));
  });
});
