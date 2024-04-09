import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './Route';



import {Provider} from "react-redux"
import {createStore } from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './components/reducers/index'


const root = ReactDOM.createRoot(document.getElementById('root'));
const store =createStore(rootReducer,composeWithDevTools())
root.render(
 //<React.StrictMode>
 <Provider store={store}>
    <Router/>
 </Provider>
  //</React.StrictMode>
);
