import MainFunctionNavbar from '~/components/base/main-function/navbar';

import * as React from 'react';
import Playground from '../__playground';

interface GuiderBodyProps {
  
}

interface GuiderBodyState {
  
}

export default class GuiderBody extends React.Component<GuiderBodyProps,GuiderBodyState> {
  render(){
    return (<div className="embbed embbed-full">
      <MainFunctionNavbar activeTrail="guider"/>
      <Playground/>
    </div>);
  }
}