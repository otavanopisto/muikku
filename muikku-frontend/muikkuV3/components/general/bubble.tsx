import * as React from "react";

/**
 * BubbleProps
 */
interface BubbleProps {
  modifier?: string;
  title: any;
  content: any;
  children: any;
}

/**
 * BubbleState
 */
interface BubbleState {}

/**
 * Bubble
 */
export default class Bubble extends React.Component<BubbleProps, BubbleState> {
  /**
   * render
   * @returns JSX.Elemenet
   */
  render() {
    return (
      <div
        className={`bubble ${
          this.props.modifier ? `bubble--${this.props.modifier}` : ""
        }`}
      >
        <div className="bubble__title">{this.props.title}</div>
        <div className="bubble__content">{this.props.content}</div>
        <div className="bubble__button-container">{this.props.children}</div>
      </div>
    );
  }
}
