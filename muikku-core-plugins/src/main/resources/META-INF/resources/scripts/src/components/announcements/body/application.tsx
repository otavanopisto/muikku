import * as React from "react";
import { connect } from "react-redux";
import ReadingPanel from "~/components/general/reading-panel";
import Announcements from "./application/announcements";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/link.scss";

{
  /* Reading panel's css */
}
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/reading-panel.scss";
import "~/sass/elements/loaders.scss";

/**
 * AnnouncementsApplicationProps
 */
interface AnnouncementsApplicationProps {
  aside: React.ReactElement<any>;
  i18nOLD: i18nType;
}

/**
 * AnnouncementsApplication
 */
class AnnouncementsApplication extends React.Component<AnnouncementsApplicationProps> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const title = this.props.i18nOLD.text.get("plugin.announcements.pageTitle");
    return (
      <ReadingPanel
        modifier="announcement"
        title={title}
        asideAfter={this.props.aside}
      >
        <Announcements />
      </ReadingPanel>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @returns object
 */
const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsApplication);
