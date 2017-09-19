import Notifications from '../components/base/notifications.tsx';
import Body from '../components/frontpage/body.tsx';
import * as React from 'react';

export default class IndexFrontpage extends React.Component {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}