import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/toc.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/item-list.scss";
import { AnnouncementsType } from "reducers/announcements";

/**
 * OrganizationManagementAsideProps
 */
interface OrganizationManagementAsideProps {
  i18nOLD: i18nType;
  announcements: AnnouncementsType;
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
    i18nOLD: state.i18nOLD,
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
