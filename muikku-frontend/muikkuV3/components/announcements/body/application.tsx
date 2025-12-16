import * as React from "react";
import { connect } from "react-redux";
import ReadingPanel from "~/components/general/reading-panel";
import Announcements from "./application/announcements";
import { withTranslation, WithTranslation } from "react-i18next";
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
interface AnnouncementsApplicationProps extends WithTranslation {
  aside: React.ReactElement<any>;
}

/**
 * AnnouncementsApplication
 */
class AnnouncementsApplication extends React.Component<AnnouncementsApplicationProps> {
  /**
   * componentDidMount
   */
  componentDidMount() {
    this.props.i18n.setDefaultNamespace("messaging");
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const title = this.props.i18n.t("labels.announcements", {
      ns: "messaging",
    });
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
 * mapDispatchToProps
 * @returns object
 */
const mapDispatchToProps = () => ({});

export default withTranslation("messaging")(
  connect(null, mapDispatchToProps)(AnnouncementsApplication)
);
