import MainFunctionNavbar from '../base/main-function/navbar';
import Application from './body/application';

import * as React from 'react';

export default class RecordsBody extends React.Component<{},{}> {
  render(){
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="records" />
      <Application />
    </div>);
  }
}