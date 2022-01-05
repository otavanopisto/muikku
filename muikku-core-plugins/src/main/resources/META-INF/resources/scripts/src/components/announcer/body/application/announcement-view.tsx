import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "~/components/general/link";
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
import { AnnouncementsType } from "~/reducers/announcements";
import { UserIndexType } from "~/reducers/user-index";

interface MessageViewProps {
  i18n: i18nType;
  announcements: AnnouncementsType;
  userIndex: UserIndexType;
}

interface MessageVitewState {
  drag: number;
}

class AnnouncementView extends React.Component<
  MessageViewProps,
  MessageVitewState
> {
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
                      <span className="label__icon label__icon--announcement-workspace icon-books"></span>
                      <span className="label__text label__text--announcement-workspace">
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

//TODO fix this is using the other version of announcements
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    announcements: state.announcements,
    userIndex: state.userIndex,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementView);
