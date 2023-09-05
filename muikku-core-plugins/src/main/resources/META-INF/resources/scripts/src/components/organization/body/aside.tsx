import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/toc.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/item-list.scss";
import { AnnouncementsState } from "reducers/announcements";

/**
 * OrganizationManagementAsideProps
 */
interface OrganizationManagementAsideProps {
  announcements: AnnouncementsState;
}

/**
 * OrganizationManagementAsideState
 */
interface OrganizationManagementAsideState {}

/**
 * OrganizationManagementAside
 */
class OrganizationManagementAside extends React.Component<
  OrganizationManagementAsideProps,
  OrganizationManagementAsideState
> {
  /**
   * render
   */
  render() {
    return <section className="toc"></section>;
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    announcements: state.announcements,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationManagementAside);
