import MainFunctionNavbar from '../base/main-function/navbar';

import * as React from 'react';

export default class IndexBody extends React.Component<{},{}> {
  render(){
    return (<div className="container container--full">
      <MainFunctionNavbar activeTrail="records"/>
    </div>);
  }
}