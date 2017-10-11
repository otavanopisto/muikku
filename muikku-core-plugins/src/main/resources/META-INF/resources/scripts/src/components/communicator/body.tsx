import MainFunctionNavbar from '~/components/base/main-function/navbar';
import Application from './body/application';
import Navigation from './body/aside';

import * as React from 'react';

import '~/sass/elements/container.scss';

interface CommunicatorBodyProps {
  
}

interface CommunicatorBodyState {
  
}

export default class CommunicatorBody extends React.Component<CommunicatorBodyProps,CommunicatorBodyState> {
  render(){
    let navigation = <Navigation/>
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="communicator" navigation={navigation}/>
      <Application aside={aside}/>
        
    </div>);
  }
}