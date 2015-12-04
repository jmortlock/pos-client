
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import GridButton from './GridButton';
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
                {
                        this.props.page.rows.map(row =>
                                <Row>
                                  { row.cols.map( col => <Col md={2}>
                                      <GridButton style={this.props.style} type={col.type} payload={col.payload} callback={this.props.callback} text={col.text}></GridButton></Col>) }
                                </Row>
                        )

                }
              </Grid>
            </div>;
  }
});
