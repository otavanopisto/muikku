import MainFunctionNavbar from '~/components/base/main-function/navbar';
import Application from './body/application';
import Navigation from './body/navigation';

import * as React from 'react';

export default class CommunicatorBody extends React.Component {
  render(){
    let navigation = <Navigation/>
    return (<div className="embbed embbed-full">
      <MainFunctionNavbar activeTrail="communicator" navigation={navigation}/>
      <Application navigation={navigation}/>
    </div>);
  }
}