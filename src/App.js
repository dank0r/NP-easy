import React from 'react';
import './App.module.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import thunk from "redux-thunk";
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import { createBrowserHistory } from 'history';
import MainPage from './components/pages/MainPage/';
import CompetitionPage from './components/pages/CompetitionPage/';

const client = axios.create({
  baseURL:'http://194.87.239.214:9090/',
  responseType: 'json'
});

const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));

function Competition() {
  const { competitionId } = useParams();
  return (<div>{competitionId}</div>);
}

const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <Switch>
          <Route exact path="/">
            <MainPage />
          </Route>
          <Route exact path="/competition/:competitionId">
            <CompetitionPage />
          </Route>
        </Switch>
      </Provider>
    </Router>
  );
}

export default App;
