import Notifications from '../components/base/notifications.jsx';
import Body from '../components/frontpage/body.jsx';

export default class IndexFrontpage extends React.Component {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}