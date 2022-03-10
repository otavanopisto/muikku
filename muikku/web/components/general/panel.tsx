import * as React from "react";
import "~/sass/elements/panel.scss";

/**
 * PanelProps
 */
interface PanelProps {
  modifier?: string;
}

/**
 * PanelState
 */
interface PanelState {}

/**
 * Panel
 */
export default class Panel extends React.Component<PanelProps, PanelState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div
        className={`panel ${
          this.props.modifier ? "panel--" + this.props.modifier : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}
