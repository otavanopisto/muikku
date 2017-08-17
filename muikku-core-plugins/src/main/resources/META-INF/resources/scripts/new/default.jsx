import thunk from 'redux-thunk'

export default function runApp(reducer, App, callback){
  let store = Redux.createStore(reducer, Redux.applyMiddleware(thunk));

  let Provider = ReactRedux.Provider;

  ReactDOM.render(<Provider store={store}>
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