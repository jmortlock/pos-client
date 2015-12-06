import TextBufferNotification from './TextBufferNotification';
import TransactionList from './TransactionList';
import GridPage from './GridPage';

import {Grid, Row, Col, Modal, Button} from 'react-bootstrap';
import React from 'react';
import {connect} from 'react-redux';

import * as actionCreators from '../action_creators';

const modalInstance = (
  <div className="static-modal">
    <Modal.Dialog>
      <Modal.Header>
        <Modal.Title>Modal title</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        One fine body...
      </Modal.Body>

      <Modal.Footer>
        <Button>Close</Button>
        <Button bsStyle="primary">Save changes</Button>
      </Modal.Footer>

    </Modal.Dialog>
  </div>
);

//This is the hookup for the
//Tranasction List the Keyboard Grid and the
//Text Buffer Status.
export const PointOfSaleMain = React.createClass({
  render: function() {

    if (this.props.showModal) {

    }

    return <div class="TextBufferNotification">
      <div>

        { this.props.showModal ? modalInstance : "" }



        <br/>
      <Grid fluid>
        <Row className="show-grid">
          <Col md={12}>
              <GridPage style={"primary"} page={this.props.navpage} callback={this.props.genericButtonPress}/>
          </Col>
          <Col md={12}>
            <TextBufferNotification text={this.props.status} />
          </Col>
        </Row>
        <Row>
          <Col md={8}>
              <GridPage style={"default"} page={this.props.page} callback={this.props.genericButtonPress}/>
          </Col>
          <Col md={4}>
              <TransactionList items={this.props.items} />
          </Col>
        </Row>
      </Grid>
      </div>
    </div>;
  }
});

function mapStateToProps(state) {
  return {
    status: state.get("status_buffer", "Empty"),
    items: state.get('sale_items'),
    page: state.get('current_grid_page'),
    navpage: state.get('current_nav_page'),
    showModal: state.get("showModal")
  };
}

export const PointOfSaleMainContainer = connect(mapStateToProps, actionCreators)(PointOfSaleMain);
