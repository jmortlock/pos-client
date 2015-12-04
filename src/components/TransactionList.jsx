import React from 'react';
import {connect} from 'react-redux';
import {GridButton} from './GridButton';
import * as actionCreators from '../action_creators';

export const TransactionList = React.createClass({
  render: function() {
    var createItem = function(item) {
      return <li>{item.get("quantity")} x {item.get("description")}</li>;
    };
    return <div>status is {this.props.status}<GridButton {...this.props} /><ul>{this.props.items.map(createItem)}</ul></div>;
  }
});

function mapStateToProps(state) {
  return {
    status: state.get("status_buffer", "Empty"),
    items: state.get('sale_items'),
  };
}

export const TransactionListContainer = connect(mapStateToProps, actionCreators)(TransactionList);
