import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import ScrollToTop from './hooks/ScrollToTop';

import CardholderHome from './containers/Cardholder/CardholderHome';
import MerchantHome from './containers/Merchant/MerchantHome';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
import MerchantQs from './containers/Merchant/MerchantQs';
import UserSettings from './containers/Merchant/UserSettings';
import CreateOffer from './containers/Merchant/CreateOffer';
import NotFound from './containers/NotFound';

import 'antd/dist/antd.css';

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  username: null,
  jwt: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("username", JSON.stringify(action.payload.user.username));
      localStorage.setItem("jwt", JSON.stringify(action.payload.jwt));
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        jwt: action.payload.jwt,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        username: null,
      };
    default:
      return state;
  }
};

axios.defaults.baseURL = 'https://api.offerize.xyz';

function App() {

  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const username = JSON.parse(localStorage.getItem('username') || null);
    const jwt = JSON.parse(localStorage.getItem('jwt') || null);

    const user = { username: username };

    if (username && jwt) {
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
          jwt,
        }
      })
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      <Router>
        <ScrollToTop />
        <div>
          <Switch>
            <Route exact path='/' component={CardholderHome} />
            <Route path='/signin' component={Signin} />
            <Route path='/signup' component={Signup} />
            <Route path='/merchant' component={MerchantHome} />
            <Route path='/merchantQs' component={MerchantQs} />
            <Route path='/merchantSettings' component={UserSettings} />
            <Route path='/merchantCreateOffer' component={CreateOffer} />
            <Route default component={NotFound} />
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider >

  );
}

export default App;
