import Notifications from '../components/base/notifications';
import Body from '../components/index/body';
import * as React from 'react';
import '~/sass/util/base.scss';
import CheckContactInfoDialog from '~/components/base/check-contact-info-dialog';

export default class Index extends React.Component<{},{}> {
  render(){
    return (<div id="root">
      <Notifications></Notifications>
      <Body></Body>
      <CheckContactInfoDialog/>
    </div>);
  }
}