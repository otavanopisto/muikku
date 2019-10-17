import App from '~/containers/user_credentials';
import reducer from '~/reducers/user_credentials';
import runApp from '~/run';


let store = runApp(reducer, App);



