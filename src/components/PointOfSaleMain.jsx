import TextBufferNotification from './TextBufferNotification';
import TransactionList from './TransactionList';
import GridPage from './GridPage';

import {Grid, Row, Col} from 'react-bootstrap';
import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../action_creators';


//This is the hookup for the
//Tranasction List the Keyboard Grid and the
//Text Buffer Status.
export const PointOfSaleMain = React.createClass({
  render: function() {
    return <div class="TextBufferNotification">
      <Grid  fluid={true}>
        <Row className="show-grid">
          <Col md={12}>
            <TextBufferNotification text={this.props.status} />
          </Col>
        </Row>
        <Row>
          <Col md={8}>
              <GridPage callback={this.props.genericButtonPress}/>
          </Col>
          <Col md={4}>
              <TransactionList items={this.props.items} />
          </Col>
        </Row>
      </Grid>
    </div>;
  }
});

function mapStateToProps(state) {
  return {
    status: state.get("status_buffer", "Empty"),
    items: state.get('sale_items'),
  };
}

export const PointOfSaleMainContainer = connect(mapStateToProps, actionCreators)(PointOfSaleMain);
