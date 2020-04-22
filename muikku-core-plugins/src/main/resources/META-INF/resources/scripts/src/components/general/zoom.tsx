import * as React from "react";

import '~/sass/elements/zoom.scss';

interface ZoomProps {
  imgsrc: string;
}

interface ZoomState {
  zoomed: boolean;
}

export default class Zoom extends React.Component<ZoomProps, ZoomState>{
  constructor(props: ZoomProps){
    super(props);
    
    this.state = {
      zoomed: false,
    }
    
    this.toggleZoom = this.toggleZoom.bind(this);
  }
  
  toggleZoom() {
    this.setState({
      zoomed: !this.state.zoomed,
    });
  }
    
  render() {
    let zoomComponent: React.ReactNode = null;
    if (this.state.zoomed) {
      const img = <div className="zoom-image" style={{backgroundImage: "url(" + this.props.imgsrc + ")"}}/>
      zoomComponent = <div className="zoom">
        <div className="zoom-children">
          {img}
          <div className="zoom-close icon-cross"/>
        </div>
      </div>
    }
    return(
      <div onClick={this.toggleZoom} className="zoom-container">
        <div className="zoom-container-clickable-item">
          {this.props.children}
        </div>
        {zoomComponent}
      </div>
    )
  }
  
}