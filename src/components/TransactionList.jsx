import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table} from 'react-bootstrap';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    var createItem = function(item) {
      return <tr>
                <td>{item.get("quantity")}</td>
                <td>{item.get("description")}</td>
              </tr>;
    };
    return <div><Table response hover striped ><thead><tr><th>Qty</th><th>Description</th></tr></thead>{this.props.items.map(createItem)}</Table></div>;
  }
});
