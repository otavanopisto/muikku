import MainFunctionNavbar from '../main-function/navbar.jsx';
import ScreenContainer from '../general/screen-container.jsx';

import React from 'react';

export default class CommunicatorBody extends React.Component {
  render(){
    return (<div className="embed embed-full">
      <MainFunctionNavbar activeTrail="communicator"/>
      <ScreenContainer>
        <div/>
      </ScreenContainer>
    </div>);
  }
}