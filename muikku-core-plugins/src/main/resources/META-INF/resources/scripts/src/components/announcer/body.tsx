import MainFunctionNavbar from '~/components/base/main-function/navbar';

import * as React from 'react';
import Playground from '../__playground';

interface AnnouncerBodyProps {
  
}

interface AnnouncerBodyState {
  
}

export default class AnnouncerBody extends React.Component<AnnouncerBodyProps,AnnouncerBodyState> {
  render(){
    return (<div className="embbed embbed-full">
      <MainFunctionNavbar activeTrail="announcer"/>
      <Playground/>
    </div>);
  }
}