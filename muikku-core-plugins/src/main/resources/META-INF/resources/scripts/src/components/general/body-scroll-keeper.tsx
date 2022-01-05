import * as React from "react";

interface BodyScrollKeeperProps {
  hidden: boolean;
  children: any;
}

interface BodyScrollKeeperState {}

export default class BodyScrollKeeper extends React.Component<
  BodyScrollKeeperProps,
  BodyScrollKeeperState
> {
  private lastPosition: number;
  constructor(props: BodyScrollKeeperProps) {
    super(props);

    this.lastPosition = 0;
  }
  componentWillReceiveProps(nextProps: BodyScrollKeeperProps) {
    if (nextProps.hidden && !this.props.hidden) {
      this.lastPosition =
        document.body.scrollTop || document.documentElement.scrollTop;
    }
  }
  componentDidUpdate(prevProps: BodyScrollKeeperProps) {
    if (prevProps.hidden && !this.props.hidden) {
      document.body.scrollTop = this.lastPosition;
      document.documentElement.scrollTop = this.lastPosition;
    }
  }
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
