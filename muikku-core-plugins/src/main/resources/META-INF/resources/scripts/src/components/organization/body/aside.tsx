import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/toc.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/item-list.scss";
import { AnnouncementsType } from "reducers/announcements";

interface OrganizationManagementAsideProps {
  i18n: i18nType;
  announcements: AnnouncementsType;
}

interface OrganizationManagementAsideState {}

class OrganizationManagementAside extends React.Component<
  OrganizationManagementAsideProps,
  OrganizationManagementAsideState
> {
  render() {
    return <section className="toc"></section>;
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    announcements: state.announcements,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationManagementAside);
