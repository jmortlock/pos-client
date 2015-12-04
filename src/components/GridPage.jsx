
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import {GridButton} from './GridButton';
import {Grid, Row, Col} from 'react-bootstrap';


export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    var rows = [];
    for(var i=0; i < 6; i++) {
      rows.push(<Col md={2}><GridButton callback={this.props.callback} text={ '0,'+ i }></GridButton>  </Col>);
    };

    return <div>
              <Grid fluid>
                <Row>
                  {rows}
                </Row>
                <Row>
                  {rows}
                </Row>
                <Row>
                  {rows}
                </Row>
                <Row>
                  {rows}
                </Row>
                <Row>
                  {rows}
                </Row>
                <Row>
                  {rows}
                </Row>
                <Row>
                  {rows}
                </Row>
                <Row>
                  {rows}
                </Row>
              </Grid>
            </div>;
  }
});
