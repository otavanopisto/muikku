import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
import { i18nType } from "~/reducers/base/i18n";
import { AnnouncementType, AnnouncementsType } from "~/reducers/announcements";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/label.scss";
import "~/sass/elements/item-list.scss";

/**
 * AnnouncementsAsideProps
 */
interface AnnouncementsAsideProps {
  i18n: i18nType;
  announcements: AnnouncementsType;
}

/**
 * AnnouncementsAsideState
 */
interface AnnouncementsAsideState {}

/**
 * AnnouncementsAside
 */
class AnnouncementsAside extends React.Component<
  AnnouncementsAsideProps,
  AnnouncementsAsideState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="react-required-container">
        {this.props.announcements.announcements.length !== 0 ? (
          <div className="item-list item-list--panel-announcements">
            {this.props.announcements.announcements.map(
              (announcement: AnnouncementType) => {
                const extraWorkspaces =
                  announcement.workspaces && announcement.workspaces.length
                    ? announcement.workspaces.length - 1
                    : 0;
                return (
                  <Link
                    key={announcement.id}
                    className={`item-list__item item-list__item--announcements ${
                      announcement.workspaces.length
                        ? "item-list__item--has-workspaces"
                        : ""
                    }`}
                    href={`#${announcement.id}`}
                  >
                    <span className="item-list__icon item-list__icon--announcements icon-paper-plane"></span>
                    <span className="item-list__text-body item-list__text-body--multiline">
                      <span className="item-list__announcement-caption">
                        {announcement.caption}
                      </span>
                      <span className="item-list__announcement-date">
                        {this.props.i18n.time.format(announcement.startDate)}
                      </span>
                      {announcement.workspaces &&
                      announcement.workspaces.length ? (
                        <div className="labels item-list__announcement-workspaces">
                          <span className="label">
                            <span className="label__icon label__icon--announcement-workspace icon-books"></span>
                            <span className="label__text label__text--announcement-workspace">
                              {announcement.workspaces[0].name}{" "}
                              {announcement.workspaces[0].nameExtension
                                ? "(" +
                                  announcement.workspaces[0].nameExtension +
                                  ")"
                                : null}
                            </span>
                          </span>
                          {extraWorkspaces ? (
                            <span className="label">
                              {"(+" + extraWorkspaces + ")"}
                            </span>
                          ) : null}
                        </div>
                      ) : null}
                    </span>
                  </Link>
                );
              }
            )}
          </div>
        ) : (
          <div>{this.props.i18n.text.get("plugin.announcer.empty.title")}</div>
        )}
      </div>
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
    announcements: state.announcements,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementsAside);
