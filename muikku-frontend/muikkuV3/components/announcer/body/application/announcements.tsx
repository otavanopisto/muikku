import * as React from "react";
import { connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { Action, bindActionCreators, Dispatch } from "redux";
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
import {
  AnnouncementsState,
  AnnouncementsStateType,
} from "~/reducers/announcements";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import SelectableList from "~/components/general/selectable-list";
import Link from "~/components/general/link";
import {
  AddToAnnouncementsSelectedTriggerType,
  RemoveFromAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected,
  addToAnnouncementsSelected,
  LoadMoreAnnouncementsTriggerType,
  loadMoreAnnouncements,
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
import BodyScrollLoader from "~/components/general/body-scroll-loader";
import { colorIntToHex } from "~/util/modifiers";
/**
 * AnnouncementsProps
 */
interface AnnouncementsProps extends WithTranslation {
  announcements: AnnouncementsState;
  userIndex: UserIndexState;
  hasMore: boolean;
  state: AnnouncementsStateType;
  loadMoreAnnouncements: LoadMoreAnnouncementsTriggerType;
  addToAnnouncementsSelected: AddToAnnouncementsSelectedTriggerType;
  removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType;
}

/**
 * AnnouncementsState
 */
interface AnnouncementsComponentState {}

/**
 * Announcements
 */
class Announcements extends BodyScrollLoader<
  AnnouncementsProps,
  AnnouncementsComponentState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: AnnouncementsProps) {
    super(props);
    this.statePropertyLocation = "state";
    this.hasMorePropertyLocation = "hasMore";
    this.loadMoreTriggerFunctionLocation = "loadMoreAnnouncements";
  }

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
              const modifiers = announcement.unread
                ? "application-list__item--highlight"
                : "";
              return {
                as: ApplicationListItem,
                className,
                modifiers,
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
                      <ApplicationListHeaderPrimary modifiers="announcement-meta">
                        {announcement.pinnedToSelf && (
                          <span
                            title={this.props.i18n.t("labels.pinnedToSelf", {
                              ns: "messaging",
                            })}
                            className="icon announcement__icon--pinned-to-self icon-pin"
                          ></span>
                        )}
                        {announcement.pinned && (
                          <span className="icon icon-pin"></span>
                        )}
                        <ApplicationListItemDate
                          startDate={localize.date(announcement.startDate)}
                          endDate={localize.date(announcement.endDate)}
                        />
                      </ApplicationListHeaderPrimary>
                    </ApplicationListItemHeader>
                    <ApplicationListItemBody
                      modifiers={announcement.unread ? "unread" : ""}
                      header={announcement.caption}
                    />

                    <div className="labels item-list__announcement-workspaces">
                      {announcement.categories.length !== 0 &&
                        announcement.categories.map((category) => (
                          <span className="label" key={category.id}>
                            <span
                              style={{
                                color: colorIntToHex(category.color),
                              }}
                              className="label__icon label__icon--announcement-usergroup icon-tag"
                            ></span>
                            <span className="label__text label__text--announcement-usergroup">
                              {category.category}
                            </span>
                          </span>
                        ))}
                      {announcement.workspaces.length !== 0 &&
                        announcement.workspaces.map((workspace) => {
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
                      {announcement.userGroupEntityIds.length !== 0 &&
                        announcement.userGroupEntityIds.map((userGroupId) => {
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
    hasMore: state.announcements.hasMore,
    state: state.announcements.state,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadMoreAnnouncements,
      addToAnnouncementsSelected,
      removeFromAnnouncementsSelected,
    },
    dispatch
  );
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Announcements)
);
