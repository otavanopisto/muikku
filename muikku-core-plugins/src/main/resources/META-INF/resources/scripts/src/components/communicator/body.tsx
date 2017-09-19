import MainFunctionNavbar from '~/components/base/main-function/navbar.tsx';
import Application from './body/application.tsx';
import Navigation from './body/navigation.tsx';

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