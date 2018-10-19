import Notifications from '../components/base/notifications';
import Body from '../components/records/body';
import * as React from 'react';
import '~/sass/util/base.scss';

export default class TranscriptOfRecords extends React.Component<{},{}> {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
    </div>);
  }
}