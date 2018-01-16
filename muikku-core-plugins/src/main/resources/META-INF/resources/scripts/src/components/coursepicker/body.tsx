import MainFunctionNavbar from '~/components/base/main-function/navbar';
import Application from './body/application';
import Aside from './body/aside';

import * as React from 'react';

import '~/sass/elements/container.scss';

interface CoursepickerBodyProps {
  
}

interface CoursepickerBodyState {
  
}

export default class CommunicatorBody extends React.Component<CoursepickerBodyProps, CoursepickerBodyState> {
  render(){
    let aside = <Aside />
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="coursepicker" navigation={aside}/>
      <Application aside={aside}/>
    </div>);
  }
}