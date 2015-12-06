import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {PageHeader, Well, Panel} from 'react-bootstrap';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return <div className="textBuffer">
      {
      <div><br /><Panel><strong>{ this.props.text }</strong></Panel></div>
      }
    </div>;
  }
});
