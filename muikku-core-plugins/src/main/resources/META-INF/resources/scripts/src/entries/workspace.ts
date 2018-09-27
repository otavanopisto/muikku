import App from '~/containers/workspace';
import reducer from '~/reducers/workspace';
import runApp from '~/run';

import mainFunctionDefault from '~/util/base-main-function';

runApp(reducer, App, (store)=>{
  let websocket = mainFunctionDefault(store, {setupMessages: false});
  return {websocket};
});