import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';

export const GridButton = React.createClass({
  render: function() {

    return <div>
            <Button bsStyle="default" bsSize="large" block>{ this.props.text }</Button>
          </div>;
  }
});
