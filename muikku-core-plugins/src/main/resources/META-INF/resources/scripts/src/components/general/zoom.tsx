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
    this.toggleBodyScroll = this.toggleBodyScroll.bind(this);
  }
  toggleBodyScroll() {
    if (this.state.zoomed) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }
  toggleZoom() {
    this.setState({
      zoomed: !this.state.zoomed,
    });
    this.toggleBodyScroll();
  }
  render() {
    let zoomComponent: React.ReactNode = null;
    if (this.state.zoomed) {
      const img = <img className="zoom__zoomed-item" src={this.props.imgsrc}/>
      zoomComponent = <div className="zoom__zoomed-item-overlay">
        <div className="zoom__zoomed-item-container">
          {img}
          <div className="zoom__zoomed-item-close icon-cross"/>
        </div>
      </div>
    }
    return(
      <div onClick={this.toggleZoom} className="zoom">
        <div className="zoom__clickable-item">
          {this.props.children}
        </div>
        {zoomComponent}
      </div>
    )
  }
}
