/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";

interface OverflowDetectorProps {
  classNameWhenOverflown: string;
  className: string;
  as: string;
  [prop: string]: any;
}

interface OverflowDetectorState {
  overflown: boolean;
}

export default class OverflowDetector extends React.Component<
  OverflowDetectorProps,
  OverflowDetectorState
> {
  constructor(props: OverflowDetectorProps) {
    super(props);

    this.state = {
      overflown: false,
    };

    this.checkOverflown = this.checkOverflown.bind(this);
  }
  componentDidMount() {
    this.checkOverflown();
  }
  componentDidUpdate() {
    this.checkOverflown();
  }
  checkOverflown() {
    const element: HTMLElement = this.refs["element"] as HTMLElement;
    const overflown = element.scrollHeight > element.offsetHeight;
    if (this.state.overflown !== overflown) {
      this.setState({
        overflown,
      });
    }
  }
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
