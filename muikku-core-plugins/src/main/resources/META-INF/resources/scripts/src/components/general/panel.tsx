import * as React from "react";
import "~/sass/elements/panel.scss";

interface PanelProps {
  modifier?: string;
}

interface PanelState {}

export default class Panel extends React.Component<PanelProps, PanelState> {
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
