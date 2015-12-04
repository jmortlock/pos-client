import React from 'react';
import {connect} from 'react-redux';

export const GridButton = React.createClass({
  render: function() {

  const TestItem1 = {
      plu:100,
      description: 'Coopers Pale Ale',
      prices: {A:1, B:2, C:3, D:6, E:9 }
    };

    return <div>
            <button onClick={() => this.props.addItem(TestItem1, 0)} >Add PLU</button>
            <button onClick={() => this.props.removeSelectedItem()} >Remove PLU</button>
          </div>;
  }
});
