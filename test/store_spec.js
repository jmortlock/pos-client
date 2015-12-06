import { Map, List, fromJS} from 'immutable';
import {expect} from 'chai';

import makeStore from '../src/store';

describe('store', () => {

  it('is a Redux store configured with the correct reducer', () => {
    const store = makeStore();
    expect(store.getState()).to.equal(fromJS({
      sale_items: List()
    }));

    store.dispatch({
        type: 'COMPLETE_SALE'
    });

    expect(store.getState()).to.equal(fromJS({
      sale_items: List()
    }));
  });

});
