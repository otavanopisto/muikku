import thunk from "redux-thunk";
import * as React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, Reducer, Store } from "redux";
import { render } from "react-dom";
import { composeWithDevTools } from "@redux-devtools/extension";
import { StateType } from "~/reducers";

/**
 * runApp
 * @param reducer reducer
 * @param App App
 * @param beforeCreateApp beforeCreateApp
 * @returns Promise<Store<StateType>>
 */
export default async function runApp(
  reducer: Reducer<any>,
  App: any,
  beforeCreateApp?: (store: Store<StateType>) => Promise<any> | any
): Promise<Store<StateType>> {
  let store: Store<StateType>;
  if (process.env["NODE_ENV"] !== "production") {
    store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
  } else {
    store = createStore(reducer, applyMiddleware(thunk));
  }

  const newStore: Store<StateType> = {
    ...store,
    /**
     * dispatch
     * @param action action
     * @returns dispatch
     */
    dispatch(action: any) {
      if (typeof action === "function") {
        return action(store.dispatch, store.getState);
      }

      return store.dispatch(action);
    },
    /**
     * subscribe
     * @param args args
     * @returns void
     */
    subscribe(...args: any[]) {
      return (store.subscribe as any)(...args);
    },
    /**
     * getState
     * @param args args
     * @returns StateType object
     */
    getState(...args: any[]) {
      return (store.getState as any)(...args);
    },

    /**
     * replaceReducer
     * @param args args
     * @returns void
     */
    replaceReducer(...args: any[]) {
      return (store.replaceReducer as any)(...args);
    },
  };

  const preApp: HTMLElement = <HTMLElement>document.querySelector("#loading");
  if (preApp) {
    preApp.style.display = "none";
  }

  if (process.env["NODE_ENV"] !== "production") {
    (window as any).STORE_DEBUG = store;
  }

  const props: any = beforeCreateApp ? await beforeCreateApp(newStore) : {};

  render(
    React.createElement(
      Provider,
      { store: store },
      React.createElement(App, { store: store, ...props })
    ),
    document.querySelector("#app")
  );

  return newStore;
}
