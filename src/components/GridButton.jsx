import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {

    return <div>
            <div>
            <Button
              bsStyle= {this.props.style}
              bsSize="lg"
              onClick={() => this.props.callback(this.props.type, this.props.payload)}
              block>
              { this.props.text }</Button>
            </div>
          </div>;
  }
});
