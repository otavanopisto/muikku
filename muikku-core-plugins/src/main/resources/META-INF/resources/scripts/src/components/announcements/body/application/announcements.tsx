import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { colorIntToHex } from "~/util/modifiers";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-list.scss";

import "~/sass/elements/article.scss";
import "~/sass/elements/announcement.scss";
import "~/sass/elements/rich-text.scss";

import { AnnouncementType } from "~/reducers/announcements";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import SelectableList from "~/components/general/selectable-list";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";
import { UserIndexType } from "~/reducers/user-index";

interface AnnouncementProps {
  i18n: i18nType;
  announcement: AnnouncementType;
  userIndex: UserIndexType;
}

interface AnnouncementState {}

class Announcement extends React.Component<
  AnnouncementProps,
  AnnouncementState
> {
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    if (!this.props.announcement) {
      return null;
    }
    return (
      <section>
        <article className="article">
          <header className="article__header">
            {this.props.announcement.caption}
          </header>
          {this.props.announcement.workspaces.length ||
          this.props.announcement.userGroupEntityIds.length ? (
            <div className="labels">
              {this.props.announcement.workspaces.map((workspace) => (
                <span className="label" key={workspace.id}>
                  <span className="label__icon label__icon--announcement-workspace icon-books"></span>
                  <span className="label__text label__text--announcement-workspace">
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
          <section
            className="article__body rich-text"
            dangerouslySetInnerHTML={{
              __html: this.props.announcement.content,
            }}
          ></section>
        </article>
      </section>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    announcement: state.announcements.current,
    userIndex: state.userIndex,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Announcement);
