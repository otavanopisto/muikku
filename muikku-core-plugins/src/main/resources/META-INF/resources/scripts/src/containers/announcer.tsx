import Notifications from '../components/base/notifications';
import Body from '../components/announcer/body';
import * as React from 'react';
import '~/sass/util/base.scss';

export default class Announcer extends React.Component<{},{}> {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}