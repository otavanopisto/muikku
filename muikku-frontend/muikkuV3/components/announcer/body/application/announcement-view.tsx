import * as React from "react";
import { connect } from "react-redux";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/link.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/article.scss";
import "~/sass/elements/glyph.scss";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListHeaderPrimary,
  ApplicationListItemBody,
  ApplicationListItemDate,
} from "~/components/general/application-list";
import { AnnouncementsState } from "~/reducers/announcements";
import { UserIndexState } from "~/reducers/user-index";
import { AnyActionType } from "~/actions/index";
import { Action, Dispatch } from "redux";
import { WithTranslation, withTranslation } from "react-i18next";
import AnnouncementOptions from "~/components/announcements/general/announcement-options";

/**
 * MessageViewProps
 */
interface MessageViewProps extends WithTranslation {
  announcements: AnnouncementsState;
  userIndex: UserIndexState;
}

/**
 * MessageVitewState
 */
interface MessageVitewState {
  drag: number;
}

/**
 * AnnouncementView
 */
class AnnouncementView extends React.Component<
  MessageViewProps,
  MessageVitewState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (!this.props.announcements.current) {
      return null;
    }

    return (
      <ApplicationList modifiers="open">
        <ApplicationListItem
          modifiers={
            this.props.announcements.current.workspaces.length
              ? "application-list__item--workspace-announcement"
              : "application-list__item--environment-announcement"
          }
        >
          <ApplicationListItemHeader modifiers="announcer-announcement">
            <ApplicationListHeaderPrimary modifiers="announcement-meta">
              {this.props.announcements.current.pinnedToSelf && (
                <span
                  title={this.props.i18n.t("labels.pinnedToSelf", {
                    ns: "messaging",
                  })}
                  className="icon announcement__icon--pinned-to-self icon-pin"
                ></span>
              )}
              {this.props.announcements.current.pinned && (
                <span className="icon icon-pin"></span>
              )}
              <ApplicationListItemDate
                startDate={localize.date(
                  this.props.announcements.current.startDate
                )}
                endDate={localize.date(
                  this.props.announcements.current.endDate
                )}
              />
            </ApplicationListHeaderPrimary>
            {this.props.announcements.current.workspaces.length ||
            this.props.announcements.current.userGroupEntityIds.length ? (
              <div className="labels labels--announcer-announcement">
                {this.props.announcements.current.workspaces.map(
                  (workspace) => (
                    <span className="label" key={workspace.id}>
                      <span className="label__icon label__icon--workspace icon-books"></span>
                      <span className="label__text label__text--workspace">
                        {workspace.name}{" "}
                        {workspace.nameExtension
                          ? "(" + workspace.nameExtension + ")"
                          : null}
                      </span>
                    </span>
                  )
                )}
                {this.props.announcements.current.userGroupEntityIds.map(
                  (userGroupId) => {
                    if (!this.props.userIndex.groups[userGroupId]) {
                      return null;
                    }
                    return (
                      <span className="label" key={userGroupId}>
                        <span className="label__icon label__icon--announcement-usergroup icon-users"></span>
                        <span className="label__text label__text--announcement-usergroup">
                          {this.props.userIndex.groups[userGroupId].name}
                        </span>
                      </span>
                    );
                  }
                )}
              </div>
            ) : null}
          </ApplicationListItemHeader>
          <ApplicationListItemBody
            header={this.props.announcements.current.caption}
            content={this.props.announcements.current.content}
            modifiers="announcer-announcement"
          />
        </ApplicationListItem>
      </ApplicationList>
    );
  }
}

/**
 * mapStateToProps
 * ODO fix this is using the other version of announcements
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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(AnnouncementView)
);
