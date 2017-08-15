import Notifications from '../components/base/notifications.jsx';
import Body from '../components/index/body.jsx';

export default class Index extends React.Component {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}