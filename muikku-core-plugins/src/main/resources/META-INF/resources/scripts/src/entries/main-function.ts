import App from '~/containers/main-function';
import reducer from '~/reducers/main-function';
import runApp from '~/run';

import mainFunctionDefault from '~/util/base-main-function';

runApp(reducer, App, (store)=>{
  let websocket = mainFunctionDefault(store);
  return {websocket};
});