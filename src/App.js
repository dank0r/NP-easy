import React from 'react';
import './App.module.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import thunk from "redux-thunk";
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import MainPage from './components/MainPage/index.js';

const client = axios.create({
  baseURL:'http://194.87.239.214:9090/',
  responseType: 'json'
});

const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));

function App() {
  return (
    <Provider store={store}>
      <MainPage />
    </Provider>
  );
}

export default App;
