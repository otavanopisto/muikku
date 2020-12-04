import App from '~/containers/index.frontpage';
import reducer from '~/reducers/index.frontpage';
import runApp from '~/run';

runApp(reducer, App,  () => {
  // hack to remove the session if it still exists, this might
  // happen if the user session expired and he got to the homepage
  // but the chat was still active
  window.sessionStorage.removeItem("strophe-bosh-session");
});
