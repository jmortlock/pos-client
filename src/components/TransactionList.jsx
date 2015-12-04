import React from 'react';
import {connect} from 'react-redux';

export const TransactionList = React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li>{item.get("description")}</li>;
    };
    return <ul>{this.props.items.map(createItem)}</ul>;
  }
});

function mapStateToProps(state) {
  return {
    items: state.get('sale_items'),
  };
}

export const TransactionListContainer = connect(mapStateToProps)(TransactionList);
