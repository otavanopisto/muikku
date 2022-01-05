import * as React from "react";
import { connect } from "react-redux";

interface ReportsProps {}

interface ReportsState {}

class Reports extends React.Component<ReportsProps, ReportsState> {
  render() {
    return <div></div>;
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
