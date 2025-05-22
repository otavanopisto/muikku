import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import NewEditAnnouncement from "../../dialogs/new-edit-announcement";
import { localize } from "~/locales/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/announcement.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/form.scss";
import { AnnouncementsState as AnnouncementsStateType } from "~/reducers/announcements";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import SelectableList from "~/components/general/selectable-list";
import Link from "~/components/general/link";
import {
  AddToAnnouncementsSelectedTriggerType,
  RemoveFromAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected,
  addToAnnouncementsSelected,
} from "~/actions/announcements";
import DeleteAnnouncementDialog from "../../dialogs/delete-announcement";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemContentWrapper,
  ApplicationListItemFooter,
  ApplicationListItemBody,
  ApplicationListItemHeader,
  ApplicationListHeaderPrimary,
  ApplicationListItemDate,
} from "~/components/general/application-list";
import { UserIndexState } from "~/reducers/user-index";
import { withTranslation, WithTranslation } from "react-i18next";
import { Announcement } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * AnnouncementsProps
 */
interface AnnouncementsProps extends WithTranslation {
  announcements: AnnouncementsStateType;
  userIndex: UserIndexState;
  addToAnnouncementsSelected: AddToAnnouncementsSelectedTriggerType;
  removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType;
}

/**
 * AnnouncementsState
 */
interface AnnouncementsState {}

/**
 * Announcements
 */
class Announcements extends React.Component<
  AnnouncementsProps,
  AnnouncementsState
> {
  /**
   * setCurrentAnnouncement
   * @param announcement announcement
   */
  setCurrentAnnouncement(announcement: Announcement) {
    window.location.hash =
      window.location.hash.split("/")[0] + "/" + announcement.id;
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (this.props.announcements.state === "LOADING") {
      return null;
    }
    return (
      <BodyScrollKeeper hidden={!!this.props.announcements.current}>
        <SelectableList
          as={ApplicationList}
          selectModeModifiers="select-mode"
          dataState={this.props.announcements.state}
        >
          {this.props.announcements.announcements.map(
            (announcement: Announcement) => {
              const className = announcement.workspaces.length
                ? "announcement announcement--workspace"
                : "announcement announcement--environment";
              return {
                as: ApplicationListItem,
                className,
                onSelect: this.props.addToAnnouncementsSelected.bind(
                  null,
                  announcement
                ),
                onDeselect: this.props.removeFromAnnouncementsSelected.bind(
                  null,
                  announcement
                ),
                onEnter: this.setCurrentAnnouncement.bind(this, announcement),
                isSelected: this.props.announcements.selectedIds.includes(
                  announcement.id
                ),
                key: announcement.id,
                checkboxId: `announcementSelect-${announcement.id}`,
                // eslint-disable-next-line
                contents: (checkbox: React.ReactElement<any>) => (
                  <ApplicationListItemContentWrapper
                    className="announcement__content"
                    aside={
                      <div className="form-element form-element--item-selection-container">
                        <label
                          htmlFor={`announcementSelect-` + announcement.id}
                          className="visually-hidden"
                        >
                          {this.props.i18n.t("content.empty", {
                            context: "announcements",
                          })}
                        </label>
                        {checkbox}
                      </div>
                    }
                  >
                    <ApplicationListItemHeader>
                      <ApplicationListHeaderPrimary>
                        <ApplicationListItemDate
                          startDate={localize.date(announcement.startDate)}
                          endDate={localize.date(announcement.endDate)}
                        />
                      </ApplicationListHeaderPrimary>
                    </ApplicationListItemHeader>
                    <ApplicationListItemBody header={announcement.caption} />
                    {announcement.workspaces.length !== 0 ||
                    announcement.userGroupEntityIds.length !== 0 ? (
                      <div className="labels item-list__announcement-workspaces">
                        {announcement.workspaces.map((workspace) => {
                          if (announcement.workspaces.length !== 0) {
                            return (
                              <span className="label" key={workspace.id}>
                                <span className="label__icon label__icon--workspace icon-books"></span>
                                <span className="label__text label__text--workspace">
                                  {workspace.name}{" "}
                                  {workspace.nameExtension
                                    ? "(" + workspace.nameExtension + ")"
                                    : null}
                                </span>
                              </span>
                            );
                          }
                        })}
                        {announcement.userGroupEntityIds.map((userGroupId) => {
                          if (this.props.userIndex.groups[userGroupId]) {
                            return (
                              <span className="label" key={userGroupId}>
                                <span className="label__icon label__icon--announcement-usergroup icon-users"></span>
                                <span className="label__text label__text--announcement-usergroup">
                                  {
                                    this.props.userIndex.groups[userGroupId]
                                      .name
                                  }
                                </span>
                              </span>
                            );
                          }
                        })}
                      </div>
                    ) : null}
                    <ApplicationListItemFooter modifiers="announcement-actions">
                      <NewEditAnnouncement announcement={announcement}>
                        <Link
                          tabIndex={0}
                          className="link link--application-list"
                        >
                          {this.props.i18n.t("actions.edit")}
                        </Link>
                      </NewEditAnnouncement>
                      {this.props.announcements.location !== "archived" ? (
                        <DeleteAnnouncementDialog announcement={announcement}>
                          <Link
                            tabIndex={0}
                            className="link link--application-list"
                          >
                            {this.props.i18n.t("actions.remove")}
                          </Link>
                        </DeleteAnnouncementDialog>
                      ) : null}
                    </ApplicationListItemFooter>
                  </ApplicationListItemContentWrapper>
                ),
              };
            }
          )}
        </SelectableList>
      </BodyScrollKeeper>
    );
  }
}

/**
 * mapStateToProps - TODO yet another one with the different version
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    announcements: state.announcements,
    userIndex: state.userIndex,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      addToAnnouncementsSelected,
      removeFromAnnouncementsSelected,
    },
    dispatch
  );
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Announcements)
);
