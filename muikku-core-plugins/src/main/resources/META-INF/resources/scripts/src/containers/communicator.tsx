import Notifications from '../components/base/notifications';
import Body from '../components/communicator/body';
import * as React from 'react';

export default class Communicator extends React.Component<{},{}> {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}