import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/article.scss";
import "~/sass/elements/announcement.scss";
import "~/sass/elements/rich-text.scss";
import { StateType } from "~/reducers";
import { UserIndexType } from "~/reducers/user-index";
import CkeditorLoaderContent from "../../../base/ckeditor-loader/content";
import { Announcement } from "~/generated/client";
import { AnyActionType } from "~/actions";

/**
 * AnnouncementProps
 */
interface AnnouncementsProps {
  i18n: i18nType;
  announcement: Announcement;
  userIndex: UserIndexType;
}

/**
 * AnnouncementState
 */
interface AnnouncementsState {}

/**
 * Announcement
 */
class Announcements extends React.Component<
  AnnouncementsProps,
  AnnouncementsState
> {
  /**
   * componentDidUpdate
   */
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (!this.props.announcement) {
      return (
        <div>
          {this.props.i18n.text.get("plugin.announcer.announcement.empty")}
        </div>
      );
    }
    return (
      <article className="article">
        <header className="article__header">
          {this.props.announcement.caption}
        </header>
        {this.props.announcement.workspaces.length ||
        this.props.announcement.userGroupEntityIds.length ? (
          <div className="labels">
            {this.props.announcement.workspaces.map((workspace) => (
              <span className="label" key={workspace.id}>
                <span className="label__icon label__icon--workspace icon-books"></span>
                <span className="label__text label__text--workspace">
                  {workspace.name}{" "}
                  {workspace.nameExtension
                    ? "(" + workspace.nameExtension + ")"
                    : null}
                </span>
              </span>
            ))}
            {this.props.announcement.userGroupEntityIds.map((userGroupId) => {
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
            })}
          </div>
        ) : null}
        <div className="article__date">
          {this.props.i18n.time.format(this.props.announcement.startDate)}
        </div>
        <section className="article__body rich-text">
          <CkeditorLoaderContent html={this.props.announcement.content} />
        </section>
      </article>
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
    i18n: state.i18n,
    announcement: state.announcements.current,
    userIndex: state.userIndex,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns JSX.Element
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Announcements);
