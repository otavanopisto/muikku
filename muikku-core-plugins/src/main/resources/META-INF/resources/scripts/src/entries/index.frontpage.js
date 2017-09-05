import App from '~/containers/index.frontpage.jsx';
import reducer from '~/reducers/index.frontpage';
import runApp from '~/run';

runApp(reducer, App);