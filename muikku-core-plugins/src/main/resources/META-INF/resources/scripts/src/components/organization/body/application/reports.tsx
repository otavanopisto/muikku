import * as React from "react";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";

interface ReportsProps {}

interface ReportsState {}

class Reports extends React.Component<ReportsProps, ReportsState> {
  render() {
    return <div></div>;
  }
}

function mapStateToProps(state: StateType) {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
