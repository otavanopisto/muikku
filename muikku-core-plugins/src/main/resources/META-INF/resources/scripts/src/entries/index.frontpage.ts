import App from '~/containers/index.frontpage';
import reducer from '~/reducers/index.frontpage';
import runApp from '~/run';
import tabOrMouse from '~/util/tab-or-mouse';

runApp(reducer, App, ()=>{
  tabOrMouse();
});
