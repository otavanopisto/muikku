import * as React from "react";
import { connect, Dispatch } from "react-redux";

import ReadingPanel from "~/components/general/reading-panel";
import Announcements from "./application/announcements";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";

import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/link.scss";

{
  /* Reading panel's css */
}
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/reading-panel.scss";
import "~/sass/elements/loaders.scss";

interface AnnouncementsApplicationProps {
  aside: React.ReactElement<any>;
  i18n: i18nType;
}

interface AnnouncementsApplicationState {}

class AnnouncementsApplication extends React.Component<
  AnnouncementsApplicationProps,
  AnnouncementsApplicationState
> {
  render() {
    let title = this.props.i18n.text.get("plugin.announcements.pageTitle");
    return (
      <div className="reading-panel-wrapper">
        <ReadingPanel
          modifier="announcement"
          title={title}
          asideAfter={this.props.aside}
        >
          <Announcements />
        </ReadingPanel>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  };
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsApplication);
