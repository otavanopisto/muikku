/* eslint-disable @typescript-eslint/no-explicit-any */
import { applyMiddleware, createStore, Store } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "@redux-devtools/extension";
import reducer from "~/reducers/main-function";
import { StateType } from ".";

/**
 * Creates a store base
 * @param store store
 * @returns Store<StateType>
 */
const storeBase = (store: Store<StateType>) => ({
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
});

/**
 * configureStore
 * @returns Store<StateType>
 */
const configureStore = () => {
  if (process.env["NODE_ENV"] !== "production") {
    const store = createStore(
      reducer,
      composeWithDevTools(applyMiddleware(thunk))
    );
    return storeBase(store);
  }

  const store = createStore(reducer, applyMiddleware(thunk));
  return storeBase(store);
};

export default configureStore;
