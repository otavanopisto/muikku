import * as React from "react";

/**
 * DoneProps
 */
interface DoneProps {}

/**
 * DonePropsState
 */
interface DonePropsState {}

/**
 * Done
 */
class Done extends React.Component<DoneProps, DonePropsState> {
  /**
   * constructor
   * @param props
   */
  constructor(props: DoneProps) {
    super(props);

    this.state = {};
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="hops-container">
        <h1>Done</h1>
      </div>
    );
  }
}

export default Done;
