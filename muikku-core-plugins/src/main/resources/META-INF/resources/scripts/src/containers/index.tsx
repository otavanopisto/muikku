import Notifications from '../components/base/notifications';
import Body from '../components/index/body';
import * as React from 'react';
import '~/sass/util/base.scss';

export default class Index extends React.Component<{},{}> {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}