import * as React from 'react';

import '~/sass/elements/screen-container.scss';

interface ScreenContainerProps {
  children?: any,
  fullHeight?: boolean
}

interface ScreenContainerState {
  
}

export default class ScreenContainer extends React.Component<ScreenContainerProps, ScreenContainerState> {
  constructor(props: ScreenContainerProps){
    super(props);
  }
  render(){
    let isFullHeight = typeof this.props.fullHeight === "undefined" ? true : this.props.fullHeight;
    return <div className={`screen-container ${isFullHeight ? "screen-container--full-height" : ""}`}>
    <div className="screen-container__wrapper">{this.props.children}</div></div>
  }
}
