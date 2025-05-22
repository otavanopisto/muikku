import * as React from "react";
import "~/sass/elements/zoom.scss";

/**
 * ZoomProps
 */
interface ZoomProps {
  imgsrc: string;
  children?: React.ReactNode;
}

/**
 * ZoomState
 */
interface ZoomState {
  zoomed: boolean;
}

/**
 * Zoom
 */
export default class Zoom extends React.Component<ZoomProps, ZoomState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ZoomProps) {
    super(props);

    this.state = {
      zoomed: false,
    };
    this.toggleZoom = this.toggleZoom.bind(this);
    this.toggleBodyScroll = this.toggleBodyScroll.bind(this);
  }

  /**
   * toggleBodyScroll
   */
  toggleBodyScroll() {
    if (this.state.zoomed) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  }

  /**
   * toggleZoom
   */
  toggleZoom() {
    this.setState({
      zoomed: !this.state.zoomed,
    });
    this.toggleBodyScroll();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
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
      <span onClick={this.toggleZoom} className="zoom rs_skip_always">
        <span className="zoom__clickable-item">{this.props.children}</span>
        {zoomComponent}
      </span>
    );
  }
}
