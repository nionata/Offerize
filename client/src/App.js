import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CardholderHome from './containers/Cardholder/CardholderHome';
import MerchantHome from './containers/Merchant/MerchantHome';
import Signin from './containers/Signin';
import NotFound from './containers/NotFound';

import 'antd/dist/antd.css';

function App() {

  return (
    <Router>
      <div>
        <Switch>
          <Route exact path='/' component={CardholderHome} />
          <Route path='/signin' component={Signin} />
          <Route path='/merchant' component={MerchantHome} />
          <Route default component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
