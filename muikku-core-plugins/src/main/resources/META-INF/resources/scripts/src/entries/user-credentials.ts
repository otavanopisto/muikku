import App from '~/containers/user-credentials';
import reducer from '~/reducers/user-credentials';
import runApp from '~/run';


let store = runApp(reducer, App);



