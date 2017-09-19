import Notifications from '../components/base/notifications.tsx';
import Body from '../components/communicator/body.tsx';
import * as React from 'react';

export default class Communicator extends React.Component {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}