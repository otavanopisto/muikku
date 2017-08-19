import MainFunctionNavbar from '../base/main-function/navbar.jsx';
import Application from './body/application.jsx';

import React from 'react';

export default class CommunicatorBody extends React.Component {
  render(){
    return (<div className="embbed embbed-full">
      <MainFunctionNavbar activeTrail="communicator"/>
      <Application/>
    </div>);
  }
}