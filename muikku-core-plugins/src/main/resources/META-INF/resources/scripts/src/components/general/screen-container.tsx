import * as React from 'react';

import '~/sass/elements/screen-container.scss';

interface ScreenContainerProps {
  children?: React.ReactElement<any>
}

interface ScreenContainerState {
  
}

export default class ScreenContainer extends React.Component<ScreenContainerProps, ScreenContainerState> {
  constructor(props: ScreenContainerProps){
    super(props);
  }
  render(){
    return <div className="screen-container screen-container--full-height">
    <div className="screen-container__wrapper">{this.props.children}</div></div>
  }
}
