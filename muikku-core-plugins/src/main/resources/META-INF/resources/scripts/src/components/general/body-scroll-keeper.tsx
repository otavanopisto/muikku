import * as React from "react";

/**
 * BodyScrollKeeperProps
 */
interface BodyScrollKeeperProps {
  hidden: boolean;
  children: any;
}

/**
 * BodyScrollKeeperState
 */
interface BodyScrollKeeperState {}

/**
 * BodyScrollKeeper
 */
export default class BodyScrollKeeper extends React.Component<
  BodyScrollKeeperProps,
  BodyScrollKeeperState
> {
  private lastPosition: number;

  /**
   * constructor
   * @param props props
   */
  constructor(props: BodyScrollKeeperProps) {
    super(props);

    this.lastPosition = 0;
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: BodyScrollKeeperProps) {
    if (nextProps.hidden && !this.props.hidden) {
      this.lastPosition =
        document.body.scrollTop || document.documentElement.scrollTop;
    }
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: BodyScrollKeeperProps) {
    if (prevProps.hidden && !this.props.hidden) {
      document.body.scrollTop = this.lastPosition;
      document.documentElement.scrollTop = this.lastPosition;
    }
  }

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    return (
      <div
        style={{ display: this.props.hidden ? "none" : null, width: "100%" }}
      >
        {this.props.children}
      </div>
    );
  }
}
