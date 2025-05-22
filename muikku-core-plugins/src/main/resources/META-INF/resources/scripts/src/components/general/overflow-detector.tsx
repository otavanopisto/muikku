/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";

/**
 * OverflowDetectorProps
 */
interface OverflowDetectorProps {
  classNameWhenOverflown: string;
  className: string;
  as: string;
  [prop: string]: any;
}

/**
 * OverflowDetectorState
 */
interface OverflowDetectorState {
  overflown: boolean;
}

/**
 * OverflowDetector
 */
export default class OverflowDetector extends React.Component<
  OverflowDetectorProps,
  OverflowDetectorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: OverflowDetectorProps) {
    super(props);

    this.state = {
      overflown: false,
    };

    this.checkOverflown = this.checkOverflown.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.checkOverflown();
  }

  /**
   * componentDidUpdate
   */
  componentDidUpdate() {
    this.checkOverflown();
  }

  /**
   * checkOverflown
   */
  checkOverflown() {
    const element: HTMLElement = this.refs["element"] as HTMLElement;
    const overflown = element.scrollHeight > element.offsetHeight;
    if (this.state.overflown !== overflown) {
      this.setState({
        overflown,
      });
    }
  }

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    const Element: any = this.props.as;
    const givenProps: OverflowDetectorProps = Object.assign({}, this.props);
    delete givenProps["classNameWhenOverflown"];
    delete givenProps["className"];
    delete givenProps["as"];
    return (
      <Element
        {...givenProps}
        className={`${this.props.className} ${
          this.state.overflown ? this.props.classNameWhenOverflown : ""
        }`}
        ref="element"
      />
    );
  }
}
