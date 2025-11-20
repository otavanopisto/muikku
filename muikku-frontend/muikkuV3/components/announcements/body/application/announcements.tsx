import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/article.scss";
import "~/sass/elements/announcement.scss";
import "~/sass/elements/rich-text.scss";
import { StateType } from "~/reducers";
import { UserIndexState } from "~/reducers/user-index";
import CkeditorLoaderContent from "../../../base/ckeditor-loader/content";
import { withTranslation, WithTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { Announcement } from "~/generated/client";
import { AnyActionType } from "~/actions";
import { Action, Dispatch } from "redux";
import { colorIntToHex } from "~/util/modifiers";

/**
 * AnnouncementProps
 */
interface AnnouncementsProps extends WithTranslation {
  announcement: Announcement;
  userIndex: UserIndexState;
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
    const articleDate =
      this.props.announcement &&
      localize.date(this.props.announcement.startDate);

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
        <header className="article__header article__header--announcement">
          {this.props.announcement.caption}
          {this.props.announcement.pinned && (
            <span className="icon icon-pin"></span>
          )}
        </header>
        <div className="labels">
          {this.props.announcement.categories.length !== 0 && (
            <>
              {this.props.announcement.categories.map((category) => (
                <span className="label" key={category.id}>
                  <span
                    style={{ color: colorIntToHex(category.color) }}
                    className="label__icon label__icon--announcement-usergroup icon-tag"
                  ></span>
                  <span className="label__text label__text--announcement-usergroup">
                    {category.category}
                  </span>
                </span>
              ))}
            </>
          )}
          {this.props.announcement.workspaces.length !== 0 &&
            this.props.announcement.workspaces.map((workspace) => (
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
          {this.props.announcement.userGroupEntityIds.length !== 0 &&
            this.props.announcement.userGroupEntityIds.map((userGroupId) => {
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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default withTranslation("messaging")(
  connect(mapStateToProps, mapDispatchToProps)(Announcements)
);
