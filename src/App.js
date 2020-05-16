import React, { useEffect } from 'react';
import './App.module.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import { authentication } from "./actions";
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { createBrowserHistory } from 'history';
import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
  ThemeProvider
} from '@material-ui/core/styles';
import MainPage from './components/pages/MainPage/';
import CompetitionPage from './components/pages/CompetitionPage/';
import SignInPage from './components/pages/SignInPage';
import SignUpPage from './components/pages/SignUpPage';
import AlertPopUp from './components/AlertPopUp';

const client = axios.create({
  baseURL:'http://194.87.239.214:9090/',
  responseType: 'json'
});
const store = createStore(reducer, applyMiddleware(axiosMiddleware(client, { returnRejectedPromiseOnError: true })));
const history = createBrowserHistory();

const theme = createMuiTheme({});

function App(props) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!store.getState().users.list.some(u => u.isMe) && token) {
      store.dispatch(authentication({ token }));
    }
  }, []);
  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
      <Provider store={store}>
        <AlertPopUp />
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/competition/:competitionId">
            <CompetitionPage />
          </Route>
          <Route exact path="/signin">
            <SignInPage />
          </Route>
          <Route exact path="/signup">
            <SignUpPage />
          </Route>
        </Switch>
      </Provider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
