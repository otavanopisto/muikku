/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import "~/sass/elements/reading-panel.scss";
import "~/sass/elements/loaders.scss";

/**
 * ReadingPanelProps
 */
interface ReadingPanelProps {
  modifier: string;
  title?: React.ReactElement<any> | string;
  icon?: React.ReactElement<any> | string;
  primaryOption?: React.ReactElement<any>;
  toolbar?: React.ReactElement<any>;
  asideBefore?: React.ReactElement<any>;
  asideAfter?: React.ReactElement<any>;
  aside?: React.ReactElement<any>;
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>;
}

/**
 * ReadingPanelState
 */
interface ReadingPanelState {
  sticky: boolean;
  remainingHeight: number;
}

/**
 * ReadingPanel
 */
export default class ReadingPanel extends React.Component<
  ReadingPanelProps,
  ReadingPanelState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ReadingPanelProps) {
    super(props);

    this.state = {
      sticky: false,
      remainingHeight: null,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    return (
      <div
        className={`reading-panel reading-panel--${this.props.modifier}`}
        ref="top-reference"
      >
        <div className="reading-panel__container">
          <div className="reading-panel__header">
            {this.props.title ? (
              <h1 className="reading-panel__header-title">
                {this.props.title}
              </h1>
            ) : null}
            {this.props.icon ? (
              <div className="reading-panel__header-actions">
                {this.props.icon}
              </div>
            ) : null}
          </div>
          <div className="reading-panel__body">
            <div
              style={{ display: this.state.sticky ? "block" : "none" }}
            ></div>
            {this.props.toolbar ? (
              <div className="reading-panel__actions" ref="sticky">
                {this.props.primaryOption ? (
                  <div className="reading-panel__helper-container reading-panel__helper-container--main-action">
                    {this.props.primaryOption}
                  </div>
                ) : null}
                <div className="reading-panel__main-container reading-panel__main-container--actions">
                  {this.props.toolbar}
                </div>
              </div>
            ) : null}
            <div className="reading-panel__content">
              {this.props.asideBefore ? (
                <div
                  className="reading-panel__helper-container"
                  style={{ height: this.state.remainingHeight }}
                >
                  {this.props.asideBefore}
                </div>
              ) : null}
              <div className={`reading-panel__main-container loader-empty`}>
                {this.props.children}
              </div>
              {this.props.asideAfter ? (
                <div
                  className="reading-panel__helper-container"
                  style={{ height: this.state.remainingHeight }}
                >
                  {this.props.asideAfter}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
