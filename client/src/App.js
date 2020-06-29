import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CardholderHome from './containers/Cardholder/CardholderHome';
import MerchantHome from './containers/Merchant/MerchantHome';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
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
      // localStorage.setItem("email", JSON.stringify(action.payload.user.email));
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        jwt: action.payload.jwt
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        username: null
      };
    default:
      return state;
  }
};

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
          jwt
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
        <div>
          <Switch>
            <Route exact path='/' component={CardholderHome} />
            <Route path='/signin' component={Signin} />
            <Route path='/signup' component={Signup} />
            <Route path='/merchant' component={MerchantHome} />
            <Route default component={NotFound} />
          </Switch>

        </div>
      </Router>
    </AuthContext.Provider >

  );
}

export default App;
