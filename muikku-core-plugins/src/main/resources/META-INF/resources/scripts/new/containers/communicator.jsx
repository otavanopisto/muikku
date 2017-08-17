import Notifications from '../components/base/notifications.jsx';
import Body from '../components/communicator/body.jsx';
import React from 'react';

export default class Communicator extends React.Component {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}