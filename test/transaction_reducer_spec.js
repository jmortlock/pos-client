import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

import {PriceLevelResetEnum, PriceLevelEnum} from '../src/core/price_level_enum';

describe('transaction reducer', () => {

  it('handles ADD_ITEM without initial transaction state.', () => {
    const item = { plu:100, description: 'This is a test item', prices: {A:1, B:2, C:3, D:4, E:5 }};

    const action = {type: 'ADD_ITEM', item };
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(fromJS({
          status_buffer: item.description,
          sale_items: [
              { plu: 100, price: 1, description: 'This is a test item', prices:{A:1, B:2, C:3, D:4, E:5 }, quantity: 1  },
            ]
    }));
  });

  it('handles ADD_ITEM with item in list.', () => {
    const item = { plu: 100, description: 'This is a test item', prices: {A:1.56, B:2, C:3, D:4, E:5 }};
    const action = {type: 'ADD_ITEM', item };
    const firstState = reducer(Map(), action);
    expect(firstState).to.equal(fromJS({
          status_buffer: item.description,
          sale_items: [
              { plu: 100, price: 1.56, description: 'This is a test item', prices: {A:1.56, B:2, C:3, D:4, E:5 }, quantity: 1  },
            ]
    }));

    const nextState = reducer(firstState, action);
    expect(nextState).to.equal(fromJS({
          status_buffer: item.description,
          sale_items: [
              { plu: 100, price: 1.56, description: 'This is a test item', prices: {A:1.56, B:2, C:3, D:4, E:5 }, quantity: 1  },
              { plu: 100, price: 1.56, description: 'This is a test item', prices: {A:1.56, B:2, C:3, D:4, E:5 }, quantity: 1  },
            ]
    }));
  });

  it('handles ADD_ITEM with BATCH.', () => {
    const item = { plu: 100,   description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 } };
    const item_1 = { plu: 101, description: 'Second Added Item', prices: {A:1, B:2, C:3, D:4, E:5 } };

    const actions = [
      {type: 'ADD_ITEM', item: item  },
      {type: 'ADD_ITEM', item: item_1 }
    ];

    const finalState = actions.reduce(reducer, Map());
    expect(finalState).to.equal(fromJS({
          status_buffer: item_1.description,
          sale_items: [
              { plu: 100, price: 1, description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 }, quantity: 1 },
              { plu: 101, price: 1, description: 'Second Added Item', prices: {A:1, B:2, C:3, D:4, E:5 }, quantity: 1  },
            ]
    }));
  });

  it('handles ADD_ITEM with index.', () => {
    const item = { plu: 100,   description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 } };
    const item_1 = { plu: 101, description: 'Second Added Item', prices: {A:3, B:2, C:3, D:4, E:5 } };
    const item_2 = { plu: 102, description: 'Inserted Item', prices: {A:2, B:2, C:3, D:4, E:5 } };

    const actions = [
      {type: 'ADD_ITEM', item  },
      {type: 'ADD_ITEM', item: item_1 },
      {type: 'ADD_ITEM', item: item_2, index: 1},
    ];

    const finalState = actions.reduce(reducer, Map());
    expect(finalState).to.equal(fromJS({
          sale_items: [
              { plu: 100, description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 }, quantity: 1, price: 1 },
              { plu: 102, description: 'Inserted Item', prices: {A:2, B:2, C:3, D:4, E:5 }, quantity: 1,  price: 2 },
              { plu: 101, description: 'Second Added Item', prices: {A:3, B:2, C:3, D:4, E:5 }, quantity: 1, price: 3 }
            ],
          status_buffer: item_2.description
    }));
  });

  it('handles ADD_ITEM with KeyBuffer to set Quantity', () => {

    const item = {plu: 100, description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 } };

    const actions = [
        { type: 'SET_NUMERIC_KEYBUFFER', value: 10 },
        { type: 'ADD_ITEM', item},
        { type: 'ADD_ITEM', item}
    ];

    const finalState = actions.reduce(reducer, Map());
    expect(finalState).to.equal(fromJS({
          status_buffer: item.description,
          sale_items: [
              { plu: 100, price: 1, description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 }, quantity: 10 },
              { plu: 100, price: 1, description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 }, quantity: 1 }
            ]
    }));
  });

  it('handles ADD_ITEM setting StatusBuffer when Quantity equals > 1', () => {

    const item = {plu: 100, description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 } };

    const actions = [
        { type: 'SET_NUMERIC_KEYBUFFER', value: 10 },
        { type: 'ADD_ITEM', item}
    ];

    const finalState = actions.reduce(reducer, Map());
    expect(finalState).to.equal(fromJS({
          status_buffer: '10 x ' + item.description,
          sale_items: [
              { plu: 100, price: 1, description: 'First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 }, quantity: 10 }
            ]
    }));
  });

  it('handles ADD_ITEM when not enough available portions', () => {

    const item = {plu:100, description: ' First Added Item', prices: {A:1, B:2, C:3, D:4, E:5 }};

    const portions = fromJS([
        { plu: 100, available: 0 },
        { plu: 99, available: 1 }
      ]);

    const initialState = Map().set("portions", portions);

    const action = { type: 'ADD_ITEM', item };
    const finalState = reducer(initialState, action);

    expect(finalState).to.equal(fromJS({
          warning_buffer: 'Available Portions Exceeded for this item'
    }));
  });

  it('handles ADD_ITEM with initial SET_PRICE_LEVEL state', () => {
    const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
    const priceLevel = { toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.NEVER };

    const actions = [
        { type: 'SET_PRICE_LEVEL', priceLevel},
        { type: 'ADD_ITEM', item }
      ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(fromJS({
            price_level_config: {
                reset_on: PriceLevelResetEnum.NEVER,
                current_level: PriceLevelEnum.B,
                reset_to: PriceLevelEnum.B
            },
            status_buffer:  item.description,
            sale_items: [
                { plu:100, price: 2, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }, quantity: 1}
            ],
      }));
  });

  it('handles ADD_ITEM with mid transaction change to price level state', () => {

    const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
    const priceLevel = { toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.ITEM };

    const actions = [
        { type: 'ADD_ITEM', item },
        { type: 'SET_PRICE_LEVEL', priceLevel},
        { type: 'ADD_ITEM', item }
      ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(fromJS({
            price_level_config: {
                reset_on: PriceLevelResetEnum.NEVER,
                current_level: PriceLevelEnum.A,
                reset_to: PriceLevelEnum.A
            },
            sale_items: [
                { plu:100, description: 'Item with multiple price level', prices: { A: 1, B: 2, C: 3, D: 4, E: 5 }, quantity: 1, price: 1},
                { plu:100, description: 'Item with multiple price level', prices: { A: 1, B: 2, C: 3, D: 4, E: 5 }, quantity: 1, price: 2},
            ],
            status_buffer:  item.description,
      }));

  });

  it('handles SET_PRICE_LEVEL A to existing items', () => {
      //creates the item with multiple price levels.
      const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
      const item_1 = { plu:101, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }};

      const priceLevel = { toPriceLevel: PriceLevelEnum.A, resetOn: PriceLevelResetEnum.NEVER };

      //first of all create the add item action, then adjust the price levels.
      const actions = [
          { type: 'ADD_ITEM', item },
          { type: 'ADD_ITEM', item: item_1 },
          { type: 'SET_PRICE_LEVEL', priceLevel}
        ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(fromJS({
            price_level_config: {
                reset_on: PriceLevelResetEnum.NEVER,
                current_level: PriceLevelEnum.A,
                reset_to: PriceLevelEnum.A
            },
            sale_items: [
                { plu:100, price: 1, description: 'Item with multiple price level', prices: { A: 1, B: 2, C: 3, D: 4, E: 5 }, quantity: 1},
                { plu:101, price: 2, description: 'Item with multiple price level', prices: { A: 2, B: 3, C: 4, D: 5, E: 6 }, quantity: 1}
              ],
              status_buffer:  item_1.description
            }));
  });

  it('handles SET_PRICE_LEVEL B to existing items.', () => {
      //creates the item with multiple price levels.
      const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
      const item_1 = { plu:101, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }};

      const priceLevel = { toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.NEVER };

      //first of all create the add item action, then adjust the price levels.
      const actions = [
          { type: 'ADD_ITEM', item },
          { type: 'ADD_ITEM', item: item_1 },
          { type: 'SET_PRICE_LEVEL', priceLevel}
        ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(fromJS({
            price_level_config: {
                reset_on: PriceLevelResetEnum.NEVER,
                current_level: PriceLevelEnum.B,
                reset_to: PriceLevelEnum.B
            },
            sale_items: [
                { plu:100, price: 2, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }, quantity: 1},
                { plu:101, price: 3, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }, quantity: 1}
              ],
              status_buffer:  item_1.description
            }));
  });

  it('handles SET_PRICE_LEVEL C to existing items.', () => {
      //creates the item with multiple price levels.
      const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
      const item_1 = { plu:101, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }};

      const priceLevel = { toPriceLevel: PriceLevelEnum.C, resetOn: PriceLevelResetEnum.NEVER };

      //first of all create the add item action, then adjust the price levels.
      const actions = [
          { type: 'ADD_ITEM', item },
          { type: 'ADD_ITEM', item: item_1 },
          { type: 'SET_PRICE_LEVEL', priceLevel}
        ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(fromJS({
            price_level_config: {
                reset_on: PriceLevelResetEnum.NEVER,
                current_level: PriceLevelEnum.C,
                reset_to: PriceLevelEnum.C
            },
            sale_items: [
                { plu:100, price: 3, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }, quantity: 1},
                { plu:101, price: 4, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }, quantity: 1}
              ],
              status_buffer:  item_1.description
            }));
  });

  it('handles SET_PRICE_LEVEL D to existing items', () => {
      //creates the item with multiple price levels.
      const item = { plu:100,  description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
      const item_1 = { plu:101,  description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }};

      const priceLevel = { toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.NEVER };

      //first of all create the add item action, then adjust the price levels.
      const actions = [
          { type: 'ADD_ITEM', item },
          { type: 'ADD_ITEM', item: item_1 },
          { type: 'SET_PRICE_LEVEL', priceLevel}
        ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(fromJS({
            price_level_config: {
                reset_on: PriceLevelResetEnum.NEVER,
                current_level: PriceLevelEnum.D,
                reset_to: PriceLevelEnum.D
            },
            sale_items: [
                { plu:100, price: 4, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }, quantity: 1},
                { plu:101, price: 5, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }, quantity: 1}
              ],
              status_buffer:  item_1.description
            }));
  });

  it('handles SET_PRICE_LEVEL E to existing items', () => {
      //creates the item with multiple price levels.
      const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
      const item_1 = { plu:101, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }};

      const priceLevel = { toPriceLevel: PriceLevelEnum.E, resetOn: PriceLevelResetEnum.NEVER };

      //first of all create the add item action, then adjust the price levels.
      const actions = [
          { type: 'ADD_ITEM', item },
          { type: 'ADD_ITEM', item: item_1 },
          { type: 'SET_PRICE_LEVEL', priceLevel}
        ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(fromJS({
            price_level_config: {
                reset_on: PriceLevelResetEnum.NEVER,
                current_level: PriceLevelEnum.E,
                reset_to: PriceLevelEnum.E
            },
            sale_items: [
                { plu:100, price: 5, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }, quantity: 1},
                { plu:101, price: 6, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }, quantity: 1}
              ],
              status_buffer:  item_1.description
            }));
  });

  it('handles COMPLETE_SALE removes transient state + sale_items', () => {

    const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
    const item_1 = { plu:101, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }};

    const priceLevel = { toPriceLevel: PriceLevelEnum.E, resetOn: PriceLevelResetEnum.NEVER };

    //first of all create the add item action, then adjust the price levels.
    const actions = [
        { type: 'ADD_ITEM', item },
        { type: 'ADD_ITEM', item: item_1 },
        { type: 'COMPLETE_SALE' }
      ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(Map());
  });

  it('COMPLETE_SALE leaves price level at last configured state', () => {
    const actions = [
      { type: 'SET_PRICE_LEVEL', priceLevel: { toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.NEVER }},
      { type: 'COMPLETE_SALE' }
    ];

    const finalState = actions.reduce(reducer, Map());
    expect(finalState).to.equal(fromJS({
          price_level_config: {
              reset_on: PriceLevelResetEnum.NEVER,
              current_level: PriceLevelEnum.D,
              reset_to: PriceLevelEnum.D
          }
    }));
  });

  it('COMPLETE_SALE resets price level state to a previous level (NOT A)', () => {

    const item = { plu:100, description: 'Item with multiple price level', prices: { A : 1, B: 2, C: 3, D: 4, E: 5 }};
    const item_1 = { plu:101, description: 'Item with multiple price level', prices: { A : 2, B: 3, C: 4, D: 5, E: 6 }};

    const priceLevel = { toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.SALE };

    //first of all create the add item action, then adjust the price levels.
    const actions = [
        { type: 'ADD_ITEM', item },
        { type: 'ADD_ITEM', item: item_1 },
        { type: 'SET_PRICE_LEVEL', priceLevel: { toPriceLevel: PriceLevelEnum.E, resetOn: PriceLevelResetEnum.NEVER }},
        { type: 'SET_PRICE_LEVEL', priceLevel: { toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.SALE }},
        { type: 'COMPLETE_SALE' }
      ];

      const finalState = actions.reduce(reducer, Map());
      expect(finalState).to.equal(fromJS({
            price_level_config: {
                reset_on: PriceLevelResetEnum.NEVER,
                current_level: PriceLevelEnum.E,
                reset_to: PriceLevelEnum.E
            }
      }));
  });

  it('SET_PRICE_LEVEL changes RESET TO PriceLevel on Sale RESET types', () => {
    const priceLevel = { toPriceLevel: PriceLevelEnum.C, resetOn: PriceLevelResetEnum.SALE };
    const actions = [
      { type: 'SET_PRICE_LEVEL', priceLevel }
    ];

    const finalState = actions.reduce(reducer, Map());
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
    const priceLevel = { toPriceLevel: PriceLevelEnum.D, resetOn: PriceLevelResetEnum.NEVER };
    const actions = [
      { type: 'SET_PRICE_LEVEL', priceLevel }
    ];

    const finalState = actions.reduce(reducer, Map());
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

    const priceLevel = { toPriceLevel: PriceLevelEnum.B, resetOn: PriceLevelResetEnum.NEVER };
    const actions = [
      { type: 'SET_PRICE_LEVEL', priceLevel },
      { type: 'RESET_PRICE_LEVEL' }
    ];

    const finalState = actions.reduce(reducer, Map());
    expect(finalState).to.equal(fromJS({
          price_level_config: {
              reset_on: PriceLevelResetEnum.NEVER,
              current_level: PriceLevelEnum.B,
              reset_to: PriceLevelEnum.B
          },
          sale_items: []
    }));
  });

});
