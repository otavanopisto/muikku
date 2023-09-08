import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
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

/**
 * MessageViewProps
 */
interface MessageViewProps {
  i18n: i18nType;
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
              <ApplicationListItemDate
                startDate={this.props.i18n.time.format(
                  this.props.announcements.current.startDate
                )}
                endDate={this.props.i18n.time.format(
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
    i18n: state.i18n,
    announcements: state.announcements,
    userIndex: state.userIndex,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementView);
