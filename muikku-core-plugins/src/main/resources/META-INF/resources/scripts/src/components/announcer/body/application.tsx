import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Announcements from "./application/announcements";
import AnnouncementView from "./application/announcement-view";
import HoverButton from "~/components/general/hover-button";
import Button from "~/components/general/button";
import Toolbar from "./application/toolbar";
import NewEditAnnouncement from "../dialogs/new-edit-announcement";
import { AnyActionType, AnyActionTypeDispatch } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/loaders.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { Action, Dispatch } from "redux";

/**
 * AnnouncerApplicationProps
 */
interface AnnouncerApplicationProps extends WithTranslation {
  aside: React.ReactElement<any>;
}

/**
 * AnnouncerApplicationState
 */
interface AnnouncerApplicationState {}

/**
 * AnnouncerApplication
 */
class AnnouncerApplication extends React.Component<
  AnnouncerApplicationProps,
  AnnouncerApplicationState
> {
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
    const title = this.props.i18n.t("labels.announcer");
    const primaryOption = (
      <NewEditAnnouncement>
        <Button buttonModifiers="primary-function">
          {this.props.t("actions.create", {
            ns: "messaging",
            context: "announcement",
          })}
        </Button>
      </NewEditAnnouncement>
    );
    const toolbar = <Toolbar />;

    //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
    return (
      <>
        <ApplicationPanel
          toolbar={toolbar}
          title={title}
          primaryOption={primaryOption}
          asideBefore={this.props.aside}
        >
          <Announcements />
          <AnnouncementView />
        </ApplicationPanel>
        <NewEditAnnouncement>
          <HoverButton icon="plus" modifier="new-announcement" />
        </NewEditAnnouncement>
      </>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
const mapDispatchToProps = (dispatch: AnyActionTypeDispatch) => ({});

export default withTranslation()(
  connect(null, mapDispatchToProps)(AnnouncerApplication)
);
