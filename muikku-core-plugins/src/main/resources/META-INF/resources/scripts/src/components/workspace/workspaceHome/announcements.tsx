import { WorkspaceDataType } from "~/reducers/workspaces";
import * as React from "react";
import { localize } from "~/locales/i18n";
import { connect } from "react-redux";
import Link from "~/components/general/link";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { Announcement } from "~/generated/client";

/**
 * WorkspaceAnnouncementsProps
 */
interface WorkspaceAnnouncementsProps extends WithTranslation {
  status: StatusType;
  workspace: WorkspaceDataType;
  announcements: Announcement[];
}

/**
 * WorkspaceAnnouncementsState
 */
interface WorkspaceAnnouncementsState {}

/**
 * WorkspaceAnnouncements
 */
class WorkspaceAnnouncements extends React.Component<
  WorkspaceAnnouncementsProps,
  WorkspaceAnnouncementsState
> {
  /**
   * render
   */
  render() {
    const { t } = this.props;

    if (
      this.props.status.loggedIn &&
      this.props.status.isActiveUser &&
      this.props.status.permissions.WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS
    ) {
      return (
        <div className="panel panel--workspace-announcements">
          <div className="panel__header">
            <div className="panel__header-icon panel__header-icon--workspace-announcements icon-paper-plane"></div>
            <h2 className="panel__header-title">
              {t("labels.announcement", { ns: "messaging" })}
            </h2>
          </div>
          {this.props.announcements.length && this.props.workspace ? (
            <div className="panel__body">
              <div className="item-list item-list--panel-announcements">
                {this.props.announcements.map((a) => (
                  <Link
                    to={
                      this.props.status.contextPath +
                      "/workspace/" +
                      this.props.workspace.urlName +
                      "/announcements#" +
                      a.id
                    }
                    key={a.id}
                    as="div"
                    className={`item-list__item item-list__item--announcements  ${a.unread ? "item-list__item--unread" : ""} item-list__item--has-workspaces`}
                  >
                    <span className="item-list__icon item-list__icon--announcements icon-paper-plane"></span>
                    <span className="item-list__text-body item-list__text-body--multiline">
                      <span className="item-list__announcement-caption">
                        {a.caption}
                      </span>
                      <span className="item-list__announcement-date">
                        {localize.date(a.startDate)}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="panel__body panel__body--empty">
              {t("content.empty", {
                ns: "messaging",
                context: "announcements",
              })}
            </div>
          )}
        </div>
      );
    }
    return null;
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspace: state.workspaces.currentWorkspace,
    announcements: state.announcements.announcements,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["workspace", "messaging", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceAnnouncements)
);
