import Notifications from '../components/base/notifications.tsx';
import Body from '../components/index/body.tsx';
import * as React from 'react';

export default class Index extends React.Component {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}