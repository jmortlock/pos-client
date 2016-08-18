import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table} from 'react-bootstrap';

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    var createItem = function(item) {
      return <tr>
                <td className="col-md-2">{item.get("quantity")}</td>
                <td className="col-md-8">{item.get("description")}</td>
                <td className="col-md-2">{ '$' + (item.get("quantity") * item.get("price")).toFixed(2) }</td>
            </tr>;
    };
    return <div>
      <Table response hover striped ><thead>
            <tr>
              <th className="col-md-2">Qty</th>
              <th className="col-md-8">Description</th>
              <th className="col-md-2">Price</th>
            </tr>
            </thead>
        <tbody>{this.props.items.map(createItem)}</tbody></Table></div>;
  }
});
