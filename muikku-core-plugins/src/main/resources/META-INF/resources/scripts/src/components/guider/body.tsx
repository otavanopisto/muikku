import MainFunctionNavbar from '~/components/base/main-function/navbar';

import * as React from 'react';

interface GuiderBodyProps {
  
}

interface GuiderBodyState {
  
}

export default class GuiderBody extends React.Component<GuiderBodyProps,GuiderBodyState> {
  render(){
    return (<div className="embbed embbed-full">
      <MainFunctionNavbar activeTrail="guider"/>
    </div>);
  }
}