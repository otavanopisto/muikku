import * as React from "react";

import "~/sass/elements/zoom.scss";

interface ZoomProps {
  imgsrc: string;
}

interface ZoomState {
  zoomed: boolean;
}

export default class Zoom extends React.Component<ZoomProps, ZoomState> {
  constructor(props: ZoomProps) {
    super(props);

    this.state = {
      zoomed: false
    };
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
      zoomed: !this.state.zoomed
    });
    this.toggleBodyScroll();
  }
  render() {
    let zoomComponent: React.ReactNode = null;
    if (this.state.zoomed) {
      const img = <img className="zoom__zoomed-item" src={this.props.imgsrc} />;
      zoomComponent = (
        <span className="zoom__zoomed-item-overlay">
          <span className="zoom__zoomed-item-container">
            {img}
            <span className="zoom__zoomed-item-close icon-cross" />
          </span>
        </span>
      );
    }
    return (
      <span onClick={this.toggleZoom} className="zoom">
        <span className="zoom__clickable-item">{this.props.children}</span>
        {zoomComponent}
      </span>
    );
  }
}
