import React from 'react';
<<<<<<< Updated upstream
import ConsumerHome from './containers/Cardholder/Home';
=======
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CardholderHome from './containers/Cardholder/CardholderHome';
import MerchantHome from './containers/Merchant/MerchantHome';
import Signin from './containers/Signin';
import Signup from './containers/Signup';
import NotFound from './containers/NotFound';

import 'antd/dist/antd.css';
>>>>>>> Stashed changes

export const AuthContext = React.createContext();
const initialState = {
  isAuthenticated: false,
  username: null,
  jwt: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("username", JSON.stringify(action.payload.user));
      localStorage.setItem("jwt", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        username: action.payload.username,
        token: action.payload.jwt
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
<<<<<<< Updated upstream
  return (
    <ConsumerHome />
=======

  const [state, dispatch] = React.useReducer(reducer, initialState);

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
    </AuthContext.Provider>
>>>>>>> Stashed changes
  );
}

export default App;
