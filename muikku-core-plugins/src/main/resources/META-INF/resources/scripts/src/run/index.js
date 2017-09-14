import thunk from 'redux-thunk';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {render} from 'react-dom';
import {logger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';

// TODO add a runApp that uses the history Api and takes the following
// this will speed up the application quite a lot by merging

// let store = runApp(reducer, {
//    '/index': {
//      app: IndexApp,
//      callback(store){
//        ...
//      }
//    }
//    '/communicator': {
//      app: CommunicatorApp
//      callback(store){
//         ...
//      }
//    }
// })

export default function runApp(reducer, App){
  let store;
  if (process.env.NODE_ENV !== "production"){
    store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk, logger)));
  } else {
    store = createStore(reducer, applyMiddleware(thunk));
  }
  
  render(<Provider store={store}>
    <App/>
  </Provider>, document.querySelector("#app"));
  
  let newStore = {
    dispatch(action){
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }
      
      return store.dispatch(action);
    },
    subscribe(...args){
      return store.subscribe(...args);
    },
    getState(...args){
      return store.getState(...args);
    },
    replaceReducer(...args){
      return store.replaceReducer(...args);
    }
  }
  
  let preApp = document.querySelector("#loading");
  if (preApp){
    preApp.style.display = "none";
  }
  
  if (process.env.NODE_ENV !== "production"){
    window.STORE_DEBUG = store;
  }
  
  return newStore;
}