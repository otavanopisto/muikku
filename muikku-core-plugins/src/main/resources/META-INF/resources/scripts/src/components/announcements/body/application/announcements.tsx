import * as React from "react";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/article.scss";
import "~/sass/elements/announcement.scss";
import "~/sass/elements/rich-text.scss";
import { AnnouncementType } from "~/reducers/announcements";
import { StateType } from "~/reducers";
import { UserIndexType } from "~/reducers/user-index";
import CkeditorLoaderContent from "../../../base/ckeditor-loader/content";
import { withTranslation, WithTranslation } from "react-i18next";
import { localizeTime } from "~/locales/i18n";

/**
 * AnnouncementProps
 */
interface AnnouncementProps extends WithTranslation {
  announcement: AnnouncementType;
  userIndex: UserIndexType;
}

/**
 * AnnouncementState
 */
interface AnnouncementState {}

/**
 * Announcement
 */
class Announcement extends React.Component<
  AnnouncementProps,
  AnnouncementState
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
    const articleDate =
      this.props.announcement &&
      localizeTime.date(this.props.announcement.startDate);

    if (!this.props.announcement) {
      return (
        <div>
          {this.props.i18n.t("content.empty", {
            ns: "messaging",
            context: "announcements",
          })}
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
        <div className="article__date">{articleDate}</div>
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
    announcement: state.announcements.current,
    userIndex: state.userIndex,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns JSX.Element
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default withTranslation("messaging")(
  connect(mapStateToProps, mapDispatchToProps)(Announcement)
);
