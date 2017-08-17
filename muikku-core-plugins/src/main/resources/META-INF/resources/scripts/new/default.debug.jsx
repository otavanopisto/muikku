import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import React from 'react';
import {Provider, connect} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {render} from 'react-dom';

export default function runApp(reducer, App, callback){
  let store = createStore(reducer, applyMiddleware(logger, thunk));

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
  
//  const oConnect = ReactRedux.connect;
//  ReactRedux.connect = function(mapStateToProps, mapDispatchToProps){
//    return oConnect((state)=>{
//      let value = mapStateToProps(state);
//      Object.keys(value).forEach((key)=>{
//        if (typeof value[key] === "undefined"){
//          throw new Error("Missing state value for key " + key + " you most likely forgot to combine the reducers within the root reducer file");
//        }
//      });
//    }, mapDispatchToProps);
//  }
  
  callback && callback(newStore);
}