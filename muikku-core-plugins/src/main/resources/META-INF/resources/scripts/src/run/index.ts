import thunk from 'redux-thunk';
import * as React from 'react';
import {Provider, Store} from 'react-redux';
import {createStore, applyMiddleware, Reducer} from 'redux';
import {render} from 'react-dom';
import {logger} from 'redux-logger';
import {composeWithDevTools} from 'redux-devtools-extension';
import { StateType } from '~/reducers';

//TODO screw ie11 >:(
import 'babel-polyfill';

export default async function runApp(reducer: Reducer<any>, App: any, beforeCreateApp?: (store: Store<StateType>)=>Promise<any> | any): Promise<Store<StateType>> {
  let store: Store<StateType>;
  if (process.env["NODE_ENV"] !== "production"){
    store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
  } else {
    store = createStore(reducer, applyMiddleware(thunk));
  }

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

  let props:any = beforeCreateApp ? await beforeCreateApp(newStore) : {};
  render(React.createElement(
      Provider,
      { store: store },
      React.createElement(App, { store: store, ...props })
  ), document.querySelector("#app"));

  return newStore;
}
