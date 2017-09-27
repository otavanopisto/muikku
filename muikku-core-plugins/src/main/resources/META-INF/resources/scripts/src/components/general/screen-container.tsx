import * as React from 'react';

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
    return <div className="screen-container screen-container-full-height">
    <div className="screen-container-wrapper">{this.props.children}</div></div>
  }
}