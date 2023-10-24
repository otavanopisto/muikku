import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
import { AnnouncementsState } from "~/reducers/announcements";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/label.scss";
import "~/sass/elements/item-list.scss";
import { localize } from "~/locales/i18n";
import { withTranslation, WithTranslation } from "react-i18next";
import { Announcement } from "~/generated/client";
import { AnyActionType } from "~/actions";

/**
 * AnnouncementsAsideProps
 */
interface AnnouncementsAsideProps extends WithTranslation {
  announcements: AnnouncementsState;
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
      <>
        {this.props.announcements.announcements.length !== 0 ? (
          <div className="item-list item-list--panel-announcements">
            {this.props.announcements.announcements.map(
              (announcement: Announcement) => {
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
                        {localize.date(announcement.startDate)}
                      </span>
                      {announcement.workspaces &&
                      announcement.workspaces.length ? (
                        <div className="labels item-list__announcement-workspaces">
                          <span className="label">
                            <span className="label__icon label__icon--workspace icon-books"></span>
                            <span className="label__text label__text--workspace">
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
          <div>
            {this.props.i18n.t("content.empty", { context: "announcements" })}
          </div>
        )}
      </>
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
    announcements: state.announcements,
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

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AnnouncementsAside)
);
