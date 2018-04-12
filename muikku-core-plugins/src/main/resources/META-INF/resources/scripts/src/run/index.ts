import thunk from 'redux-thunk';
import * as React from 'react';
import {Provider, Store} from 'react-redux';
import {createStore, applyMiddleware, Reducer} from 'redux';
import {render} from 'react-dom';
import {logger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import { StateType } from '~/reducers';

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

export default function runApp(reducer: Reducer<any>, App: any, existentStore: Store<StateType>=null): Store<StateType> {
  let store = existentStore;
  if (!store){
    if (process.env["NODE_ENV"] !== "production"){
      store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk, logger)));
    } else {
      store = createStore(reducer, applyMiddleware(thunk));
    }
  }
  
  render(React.createElement(
      Provider,
      { store: store },
      React.createElement(App, null)
  ), document.querySelector("#app"));
  
  let newStore:Store<StateType> = {
    dispatch(action: any){
      if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
      }
      
      return store.dispatch(action);
    },
    subscribe(...args: any[]){
      return (store.subscribe as any)(...args);
    },
    getState(...args: any[]){
      return (store.getState as any)(...args);
    },
    replaceReducer(...args: any[]){
      return (store.replaceReducer as any)(...args);
    }
  }
  
  let preApp: HTMLElement = <HTMLElement>document.querySelector("#loading");
  if (preApp){
    preApp.style.display = "none";
  }
  
  if (process.env["NODE_ENV"] !== "production"){
    (window as any).STORE_DEBUG = store;
  }
  
  return newStore;
}