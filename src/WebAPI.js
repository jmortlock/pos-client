//import { CALL_API } from 'redux-api-middleware';
import fetch from 'isomorphic-fetch';




module.exports = {

  getSalesStock: function(plu) {
    fetch(`http://192.168.0.1/sales_stock/${plu}`);
  }

};
