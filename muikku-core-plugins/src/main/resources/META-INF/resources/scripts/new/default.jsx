import thunk from 'redux-thunk';
import React from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddlewares} from 'redux';
import {render} from 'react-dom';

export default function runApp(reducer, App, callback){
  let store = createStore(reducer, applyMiddleware(thunk));

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
  
  callback && callback(newStore);
}