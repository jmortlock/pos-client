import {List, Map, fromJS} from 'immutable';
import {PriceLevelResetEnum, PriceLevelEnum} from '../core/price_level_enum';

/*
* This is the default price level configuration.
*/
const DEFAULT_PRICE_LEVEL_CONFIG = fromJS({
  reset_on: PriceLevelResetEnum.NEVER,
  current_level:  PriceLevelEnum.A,
  reset_to: PriceLevelEnum.A
});

/*
* Determine if we have enough available portions.
*/
function checkAvailablPortions(state, item, quantity) {
  if (state.has("portions")) {
        const list = state.get("portions");
        const portion = list.find(x =>  x.get("plu") === item.plu );
        if (portion) {
          return quantity < portion.available;
        }
  }
  return true;
};

/*
* reducer that takes away and temporary state information.
*/
function removeTransientStateInformation(state) {
  return state.withMutations(x => x.remove("status_buffer").remove("numeric_key_buffer").remove("portions"));
};

/*
* The current state of the price level config.
*/
function getCurrentPriceLevelCode(state) {
  return PriceLevelEnum.properties[state.get("price_level_config", DEFAULT_PRICE_LEVEL_CONFIG).get("current_level")].code;
}

/*
* Add an item to the tranasctional state.
*/
export function addItem(state, item, index) {
  const quantity = state.get("numeric_key_buffer", 1);
  const insert_list = state.get("sale_items", List());

//console.log(fromJS(item));

  const priceLevelConfig = state.get("price_level_config", DEFAULT_PRICE_LEVEL_CONFIG);

  //determine the price level code.
  const priceLevelCode = getCurrentPriceLevelCode(state);

  const price = item.prices[priceLevelCode];

  //set the quantity and price of the action item.
  const itemMap = fromJS(item).withMutations(x => { x.set("quantity", quantity).set("price", price) });

  //if we need to reset because of price level than lets do it.
  if (priceLevelConfig.get("reset_on") == PriceLevelResetEnum.ITEM) {
      state = resetPriceLevel(state);
  }

  if (!checkAvailablPortions(state, item, quantity)) {
    return removeTransientStateInformation(state).set("warning_buffer", "Available Portions Exceeded for this item")
  } else {
    const status_buffer = quantity > 1 ? quantity.toFixed(0) + " x " + item.description : item.description;
    if (index) {
      return removeTransientStateInformation(state)
                  .set("status_buffer", status_buffer)
                  .set("sale_items", insert_list.splice(index, 0, itemMap));
    } else {
       return removeTransientStateInformation(state)
                  .set("status_buffer", status_buffer)
                  .set("sale_items", insert_list.push(itemMap));
    }
  }
  return state;
};

/*
* Remove an item from the transactional state.
*/
export function removeItem(state, index) {

  if (index >= 0) {
    const list = state.get("sale_items", List());
    return state.set("sale_items", list.delete(index));
  } else {
    return state;
  }
};

/*
* remove the selected sale item.
*/
export function removeSelectedItem(state, item) {
  const index = getSelectedSaleItemIndex(state);

  if (index >= 0) {
    //remove the item from the list.
    state = removeItem(state, index);

    //reset the status buffer.
    state = state.remove("status_buffer");

    //if we are removing the first item in the List
    //then the newly selected item should be the new
    //first item.
    const hasItems = !state.get("sale_items", List()).isEmpty();
    let newIndex = index -1;
    if (newIndex < 0 && hasItems) {
       newIndex = 0;
    }

    //set the selected index to the previous item in the list.
    return setSelectedSaleItemIndex(state, newIndex);
  }
  return state;
}

export function resetPriceLevel(state) {
  if (state.has("price_level_config")) {
    const previous_level = state.get("price_level_config").get("reset_to");

    return state.set("price_level_config", Map({
      reset_on: PriceLevelResetEnum.NEVER,
      current_level: previous_level,
      reset_to: previous_level,
    }));
  }
  return state;
}

/*
* Update the sale transaction items to match the current price level.
*/
export function applyPriceLevelToCurrentTransaction(state) {
  const priceLevelCode = getCurrentPriceLevelCode(state);
  return state.set("sale_items", state.get("sale_items", List()).map(x =>  x.set("price", x.get("prices").get(priceLevelCode))));
};

/*
* Set the price level.
*/
export function setPriceLevel(state, priceLevel) {
  const sale_items = state.get("sale_items");

  let priceLevelConfig = state.get("price_level_config", DEFAULT_PRICE_LEVEL_CONFIG)
                              .withMutations(x => x.set("current_level", priceLevel.toPriceLevel)
                                                  .set("reset_on", priceLevel.resetOn));

  if (priceLevel.resetOn == PriceLevelResetEnum.NEVER) {
    priceLevelConfig = priceLevelConfig.set("reset_to", priceLevel.toPriceLevel);
  }

  state = state.set("price_level_config", Map(priceLevelConfig));

  //if its not an item based price level change than update the existing sale.
  if (priceLevel.resetOn != PriceLevelResetEnum.ITEM) {
    state = applyPriceLevelToCurrentTransaction(state);
  }

  return state;
};

/*
* Complete the sale.
*/
export function completeSale(state) {
  let priceLevelConfig = state.get("price_level_config", DEFAULT_PRICE_LEVEL_CONFIG);
  if (priceLevelConfig.get("reset_on") === PriceLevelResetEnum.SALE) {
    let config = {
      reset_on: PriceLevelResetEnum.NEVER,
      current_level:  priceLevelConfig.get("reset_to"),
      reset_to: priceLevelConfig.get("reset_to")
    };
    state = state.set("price_level_config", Map(config));
  }
  return removeTransientStateInformation(state).remove("sale_items");
};


/*
* Get the currently selected sale item.
*/
function getSelectedSaleItemIndex(state) {
  return state.get("selected_saleitem_index", -1);
}

/*
* Set the index of the currently selected tranasction item.
*/
export function setSelectedSaleItemIndex(state, index) {
  return state.set("selected_saleitem_index", index >= -1 ? index : -1);
}
