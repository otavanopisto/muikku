import App from './containers/index.frontpage.jsx';
import reducer from './reducers/index.frontpage';
import runApp from './default.debug.jsx';
import websocket from './util/websocket';

runApp(reducer, App);