import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {PageHeader, Well} from 'react-bootstrap';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div className="textBuffer">
      {
      <div><br /><Well bsSize="sm"><PageHeader>{ this.props.text }</PageHeader></Well></div>
      }
    </div>;
  }
});
