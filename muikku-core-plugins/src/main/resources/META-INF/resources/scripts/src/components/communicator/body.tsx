import MainFunctionNavbar from '~/components/base/main-function/navbar';
import Application from './body/application';
import Aside from './body/aside';

import * as React from 'react';

import '~/sass/elements/container.scss';

interface CommunicatorBodyProps {
  
}

interface CommunicatorBodyState {
  
}

export default class CommunicatorBody extends React.Component<CommunicatorBodyProps,CommunicatorBodyState> {
  render(){
    let aside = <Aside />
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="communicator" />
      <Application aside={aside}/>
        
    </div>);
  }
}