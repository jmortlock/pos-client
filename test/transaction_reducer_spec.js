import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import {webPos} from '../src/reducer';
import {PriceLevelResetEnum, PriceLevelEnum} from '../src/core/price_level_enum';
import {createAction} from 'redux-actions';
import {types} from '../src/core/actions';
import WebAPI from '../src/WebAPI';
import makeStore from '../src/store';

import nock from 'nock';
import { CALL_API } from 'redux-api-middleware';
import { apiMiddleware } from 'redux-api-middleware';

import configureStore from 'redux-mock-store';

const TestItem1 = {
  plu:100,
  description: 'Coopers Pale Ale',
  prices: {A:1, B:2, C:3, D:6, E:9 }
};

const TestItem2 = {
  plu: 101,
  description: 'Victoria Bitter',
  prices: {A:2, B:3, C:4, D:7, E:10 }
};

const TestItem3 = {
  plu: 101,
  description: 'Coopers Sparkling Ale',
  prices: {A:3, B:4, C:5, D:8, E:11 }
};

const TestItemAsync = {
  plu: 101,
  description: 'Async Item Return',
  prices: {A:3, B:4, C:5, D:8, E:11 }
};

function getSalesStock(plu) {
return {
    [CALL_API]: {
      endpoint: `http://192.168.0.1/sales_stock/${plu}`,
      method: 'GET',
      types: ['FASTPLU_REQUEST', types.FASTPLU, types.FASTPLU]
    }
}};

const middlewares = [ apiMiddleware ]
const mockStore = configureStore(middlewares);


describe('transaction reducer', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('handles FAST_PLU API Success', (done) => {
    nock('http://192.168.0.1/')
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    })
    .get('/sales_stock/100')
    .reply(200, TestItemAsync );

    const requestAction = { meta: undefined, payload: undefined, type: 'FASTPLU_REQUEST' };
    const successAction = { meta: undefined, type: types.FASTPLU, payload: TestItemAsync };

    const expectedActions = [ requestAction, successAction ];

    //const store = mockStore(Map(), expectedActions, done);
    //store.dispatch(WebAPI.getSalesStock(100));
    const action = getSalesStock(100);

    const store = mockStore(Map(), expectedActions, done);
    store.dispatch(action);
  });

  it('handles FAST_PLU API Http status 404 Item not found.', (done) => {
    nock('http://192.168.0.1/')
    .defaultReplyHeaders({
      'Content-Type': 'application/json'
    })
    .get('/sales_stock/100')
    .reply(404, {});

    const action = getSalesStock(100);

    const requestAction = { meta: undefined, payload: undefined, type: 'FASTPLU_REQUEST' };
    const failureAction = { error: true, meta: undefined, type: types.FASTPLU, payload: { message: "404 - Not Found", name: "ApiError", response: {}, "status": 404, statusText: "Not Found" } };

    const expectedActions = [ requestAction, failureAction ];

    const store = mockStore(Map(), expectedActions, done);
    store.dispatch(action);
  });

  it('handles ADD_ITEM without initial transaction state.', () => {
    const action = createAction(types.ADD_ITEM)({ item: TestItem1 });
    const nextState = webPos(undefined, action);
    expect(nextState).to.equal(fromJS({
      status_buffer: TestItem1.description,
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1  }
      ]
    }));
  });

  it('handles ADD_ITEM to Store.', () => {
    const action = createAction(types.ADD_ITEM)({ item: TestItem1 });
    const store = makeStore();
    store.dispatch(action);

    expect(store.getState()).to.equal(fromJS({
      status_buffer: TestItem1.description,
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1  }
      ]
    }));
  });

  it('handles FASTPLU_SUCCESS.', () => {
    const action = createAction(types.FASTPLU)(TestItem1); //{ type: types.FAST_PLU, payload: TestItem1  };
    const firstState = webPos(Map(), action);

    expect(firstState).to.equal(fromJS({
      status_buffer: TestItem1.description,
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1  }
      ]
    }));
  });

  it('handles FASTPLU_FAILURE', () => {
    const failureAction = { meta: undefined, error: true, type: types.FASTPLU, payload: { message: "404 - Not Found", name: "ApiError", response: {}, "status": 404, statusText: "Not Found" } };

    const firstState = webPos(Map(), failureAction);
    expect(firstState).to.equal(fromJS({
        warnings: [ '404 - Not Found' ]
    }));
  });

  it('handles ADD_ITEM with item in list.', () => {
    const action = createAction(types.ADD_ITEM)({ item: TestItem1 });

    const firstState = webPos(Map(), action);
    expect(firstState).to.equal(fromJS({
      status_buffer: TestItem1.description,
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1  },
      ]
    }));

    const nextState = webPos(firstState, action);
    expect(nextState).to.equal(fromJS({
      status_buffer: TestItem1.description,
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices,  quantity: 1, price: 1  },
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1  },
      ]
    }));
  });

  it('handles ADD_ITEM with BATCH.', () => {
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 })
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1 },
        { plu: TestItem2.plu, description: TestItem2.description, prices: TestItem2.prices, quantity: 1, price: 2 },
      ],
      status_buffer: TestItem2.description
    }));
  });

  it('handles ADD_ITEM with index.', () => {

    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.ADD_ITEM)({ item: TestItem3, index:1})
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1 },
        { plu: TestItem3.plu, description: TestItem3.description, prices: TestItem3.prices, quantity: 1, price: 3 },
        { plu: TestItem2.plu, description: TestItem2.description, prices: TestItem2.prices, quantity: 1, price: 2 }
      ],
      status_buffer: TestItem3.description
    }));
  });

  it('handles ADD_ITEM with KeyBuffer to set Quantity', () => {

    const actions = [
      createAction(types.SET_NUMERIC_KEYBUFFER)(10),
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem1 })
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 10, price: 1 },
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1 }
      ],
      status_buffer: TestItem1.description
    }));
  });

  it('handles ADD_ITEM setting StatusBuffer when Quantity equals > 1', () => {
    const actions = [
      createAction(types.SET_NUMERIC_KEYBUFFER)(10),
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 10, price: 1 }
      ],
      status_buffer: '10 x ' + TestItem1.description
    }));
  });

  it('handles ADD_ITEM when not enough available portions', () => {
    const portions = fromJS([
      { plu: 100, available: 0 },
      { plu: 99, available: 1 }
    ]);

    const initialState = Map().set("portions", portions);

    const action = createAction(types.ADD_ITEM)({ item: TestItem1 });
    const finalState = webPos(initialState, action);

    expect(finalState).to.equal(fromJS({
      warning_buffer: 'Available Portions Exceeded for this item'
    }));
  });

  it('handles ADD_ITEM with initial SET_PRICE_LEVEL state', () => {
    const priceLevel = { toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.NEVER };

    const actions = [
      createAction(types.SET_PRICE_LEVEL)(priceLevel),
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.B,
        reset_to: PriceLevelEnum.B
      },
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 2}
      ],
      status_buffer:  TestItem1.description
    }));
  });

  it('handles ADD_ITEM with mid transaction change to price level state', () => {

    const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
    const priceLevel = { toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.ITEM };

    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.SET_PRICE_LEVEL)(priceLevel),
      createAction(types.ADD_ITEM)({ item: TestItem1 })
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.A,
        reset_to: PriceLevelEnum.A
      },
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1},
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 2},
      ],
      status_buffer:  TestItem1.description,
    }));

  });

  it('handles SET_PRICE_LEVEL A to existing items', () => {
    //creates the item with multiple price levels.
    const priceLevel = { toPriceLevel: PriceLevelEnum.A, resetOn: PriceLevelResetEnum.NEVER };

    //first of all create the add item action, then adjust the price levels.
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.SET_PRICE_LEVEL)(priceLevel)
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: TestItem1.prices.A},
        { plu: TestItem2.plu, description: TestItem2.description, prices: TestItem2.prices, quantity: 1, price: TestItem2.prices.A},
      ],
      status_buffer:  TestItem2.description,
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.A,
        reset_to: PriceLevelEnum.A
      }
    }));
  });

  it('handles SET_PRICE_LEVEL B to existing items.', () => {
    //creates the item with multiple price levels.
    const priceLevel = { toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.NEVER };

    //first of all create the add item action, then adjust the price levels.
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.SET_PRICE_LEVEL)(priceLevel)
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: TestItem1.prices.B},
        { plu: TestItem2.plu, description: TestItem2.description, prices: TestItem2.prices, quantity: 1, price: TestItem2.prices.B},
      ],
      status_buffer:  TestItem2.description,
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.B,
        reset_to: PriceLevelEnum.B
      }
    }));
  });

  it('handles SET_PRICE_LEVEL C to existing items.', () => {
    //creates the item with multiple price levels.
    const priceLevel = { toPriceLevel: PriceLevelEnum.C, resetOn: PriceLevelResetEnum.NEVER };

    //first of all create the add item action, then adjust the price levels.
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.SET_PRICE_LEVEL)(priceLevel)
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: TestItem1.prices.C},
        { plu: TestItem2.plu, description: TestItem2.description, prices: TestItem2.prices, quantity: 1, price: TestItem2.prices.C},
      ],
      status_buffer:  TestItem2.description,
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.C,
        reset_to: PriceLevelEnum.C
      }
    }));
  });

  it('handles SET_PRICE_LEVEL D to existing items', () => {
    //creates the item with multiple price levels.
    const priceLevel = { toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.NEVER };

    //first of all create the add item action, then adjust the price levels.
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.SET_PRICE_LEVEL)(priceLevel)
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: TestItem1.prices.D},
        { plu: TestItem2.plu, description: TestItem2.description, prices: TestItem2.prices, quantity: 1, price: TestItem2.prices.D},
      ],
      status_buffer:  TestItem2.description,
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.D,
        reset_to: PriceLevelEnum.D
      }
    }));
  });

  it('handles SET_PRICE_LEVEL E to existing items', () => {
    //creates the item with multiple price levels.
    const priceLevel = { toPriceLevel: PriceLevelEnum.E, resetOn: PriceLevelResetEnum.NEVER };

    //first of all create the add item action, then adjust the price levels.
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.SET_PRICE_LEVEL)(priceLevel)
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: TestItem1.prices.E},
        { plu: TestItem2.plu, description: TestItem2.description, prices: TestItem2.prices, quantity: 1, price: TestItem2.prices.E},
      ],
      status_buffer:  TestItem2.description,
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.E,
        reset_to: PriceLevelEnum.E
      }
    }));
  });

  it('handles COMPLETE_SALE removes transient state + sale_items', () => {
    //first of all create the add item action, then adjust the price levels.
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.COMPLETE_SALE)()
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(Map());
  });

  it('COMPLETE_SALE leaves price level at last configured state', () => {

    const actions = [
      createAction(types.SET_PRICE_LEVEL)({ toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.NEVER }),
      createAction(types.COMPLETE_SALE)()
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.D,
        reset_to: PriceLevelEnum.D
      }
    }));
  });

  it('COMPLETE_SALE resets price level state to a previous level (NOT A)', () => {
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.SET_PRICE_LEVEL)({ toPriceLevel: PriceLevelEnum.E, resetOn: PriceLevelResetEnum.NEVER }),
      createAction(types.SET_PRICE_LEVEL)({ toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.SALE }),
      createAction(types.COMPLETE_SALE)()
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.E,
        reset_to: PriceLevelEnum.E
      }
    }));
  });

  it('SET_PRICE_LEVEL changes RESET TO PriceLevel on Sale RESET types', () => {
    const actions = [
      createAction(types.SET_PRICE_LEVEL)({ toPriceLevel: PriceLevelEnum.C, resetOn: PriceLevelResetEnum.SALE }),
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      price_level_config: {
        reset_on: PriceLevelResetEnum.SALE,
        current_level: PriceLevelEnum.C,
        reset_to: PriceLevelEnum.A
      },
      sale_items: []
    }));
  });

  it('SET_PRICE_LEVEL changes RESET TO PriceLevel on Never RESET types', () => {
    const actions = [
      createAction(types.SET_PRICE_LEVEL)({ toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.NEVER }),
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.D,
        reset_to: PriceLevelEnum.D
      },
      sale_items: []
    }));
  });

  it('RESETS_PRICE level to previous state and resets ResetOn flag', () => {
    const actions = [
      createAction(types.SET_PRICE_LEVEL)({ toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.NEVER }),
      createAction(types.RESET_PRICE_LEVEL)()
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      price_level_config: {
        reset_on: PriceLevelResetEnum.NEVER,
        current_level: PriceLevelEnum.B,
        reset_to: PriceLevelEnum.B
      },
      sale_items: []
    }));
  });

  it('handles Setting the currently selected tranasction item index.', () => {
    const action = createAction(types.SET_SELECTED_SALEITEM_INDEX)(1);
    const finalState = webPos(Map(), action);
    expect(finalState).to.equal(fromJS({
        "selected_saleitem_index": 1
    }));
  });


  it('handles REMOVE_SELECTED_ITEM with no selection set', () => {
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.SET_SELECTED_SALEITEM_INDEX)(-1),
      createAction(types.REMOVE_SELECTED_ITEM)()
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      selected_saleitem_index: -1,
      status_buffer: TestItem1.description,
      sale_items: [
        { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1  }
      ]
    }));
  });

  it('handles REMOVE_ITEM first in list', () => {
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.SET_SELECTED_SALEITEM_INDEX)(0),
      createAction(types.REMOVE_SELECTED_ITEM)()
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      sale_items: [ { plu: TestItem2.plu, description: TestItem2.description, prices: TestItem2.prices, quantity: 1, price: 2  } ],
      selected_saleitem_index: 0
    }));
  });


  it('handles REMOVE_SELECTED_ITEM last in list', () => {
    const actions = [
      createAction(types.ADD_ITEM)({ item: TestItem1 }),
      createAction(types.ADD_ITEM)({ item: TestItem2 }),
      createAction(types.SET_SELECTED_SALEITEM_INDEX)(1),
      createAction(types.REMOVE_SELECTED_ITEM)(),
    ];

    const finalState = actions.reduce(webPos, Map());
    expect(finalState).to.equal(fromJS({
      selected_saleitem_index: 0,
      sale_items: [ { plu: TestItem1.plu, description: TestItem1.description, prices: TestItem1.prices, quantity: 1, price: 1  } ]
    }));
  });


});
