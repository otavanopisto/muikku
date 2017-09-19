import App from '~/containers/index.frontpage.tsx';
import reducer from '~/reducers/index.frontpage';
import runApp from '~/run';

runApp(reducer, App);