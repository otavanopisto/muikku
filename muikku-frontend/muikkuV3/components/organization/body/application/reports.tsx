import * as React from "react";
import { connect } from "react-redux";

/**
 * ReportsProps
 */
interface ReportsProps {}

/**
 * ReportsState
 */
interface ReportsState {}

/**
 * Reports
 */
class Reports extends React.Component<ReportsProps, ReportsState> {
  /**
   * render
   */
  render() {
    return <div></div>;
  }
}

/**
 * mapStateToProps
 */
function mapStateToProps() {
  return {};
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Reports);
