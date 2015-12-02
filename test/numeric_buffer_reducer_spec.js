import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';


describe('numeric buffer reducer', () => {

  it('handles SET_NUMERIC_KEYBUFFER ', () => {
      const action = { type: 'SET_NUMERIC_KEYBUFFER', value: 10 };
      const firstState = reducer(Map(), action);
      expect(firstState).to.equal(fromJS({
            numeric_key_buffer: 10
      }));
  });

  it('handles SET_NUMERIC_KEYBUFFER with valid String parsing', () => {
    const action = { type: 'SET_NUMERIC_KEYBUFFER', value: '10' };
    const firstState = reducer(Map(), action);
    expect(firstState).to.equal(fromJS({
          numeric_key_buffer: 10
    }));
  });

  it('ignores invalid string values to SET_NUMERIC_KEYBUFFER', () => {
    const action = { type: 'SET_NUMERIC_KEYBUFFER', value: 'a10a' };
    const firstState = reducer(Map(), action);
    expect(firstState).to.equal(Map());
  });

  it('handles APPEND_NUMERIC_KEYBUFFER with no initial value', () => {
    const action = { type: 'APPEND_NUMERIC_KEYBUFFER', value: 1 };
    const firstState = reducer(Map(), action);
    expect(firstState).to.equal(fromJS({
          numeric_key_buffer: 1
    }));
  });

  it('handles batch APPEND_NUMERIC_KEYBUFFER ', () => {
    const actions = [
        { type: 'APPEND_NUMERIC_KEYBUFFER', value: 1 },
        { type: 'APPEND_NUMERIC_KEYBUFFER', value: 0 },
        { type: 'APPEND_NUMERIC_KEYBUFFER', value: 5 }
    ];

    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
          numeric_key_buffer: 105
    }));
  });

  it('handles batch APPEND_NUMERIC_KEYBUFFER ignoring invalid chars', () => {
    const actions = [
        { type: 'APPEND_NUMERIC_KEYBUFFER', value: 1 },
        { type: 'APPEND_NUMERIC_KEYBUFFER', value: 'A' },
        { type: 'APPEND_NUMERIC_KEYBUFFER', value: 5 }
    ];
    const finalState = actions.reduce(reducer, Map());
    expect(finalState).to.equal(fromJS({
          numeric_key_buffer: 15
    }));
  });
});
