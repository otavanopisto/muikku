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
import PagerV2 from "~/components/general/pagerV2";

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
interface WorkspaceAnnouncementsState {
  currentPage: number;
  itemsPerPage: number;
}

/**
 * WorkspaceAnnouncements
 */
class WorkspaceAnnouncements extends React.Component<
  WorkspaceAnnouncementsProps,
  WorkspaceAnnouncementsState
> {
  /**
   * AnnouncementsPanelProps
   * @param props props
   */
  constructor(props: WorkspaceAnnouncementsProps) {
    super(props);

    this.state = {
      itemsPerPage: 10,
      currentPage: 0,
    };
  }

  /**
   * handles page changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  handlePageChange = (selectedItem: { selected: number }) => {
    this.setState({
      currentPage: selectedItem.selected,
    });
  };

  /**
   * Gets current announcements depending on current page and items per page
   */
  getCurrentAnnouncements = () => {
    const { currentPage, itemsPerPage } = this.state;
    const allAnnouncements = [...this.props.announcements];
    const offset = currentPage * itemsPerPage;
    return allAnnouncements.slice(offset, offset + itemsPerPage);
  };

  /**
   * render
   */
  render() {
    const { t } = this.props;
    const { currentPage, itemsPerPage } = this.state;

    /**
     * Calculates amount of pages
     * depends how many items there is per page
     */
    const pageCount = Math.ceil(this.props.announcements.length / itemsPerPage);
    /**
     * renders pagination body as one of announcements list item
     */
    const renderPaginationBody = (
      <div
        className="item-list__item item-list__item--announcements"
        aria-label={this.props.t("wcag.pager", { ns: "messaging" })}
      >
        <span className="item-list__text-body item-list__text-body--multiline--footer">
          <PagerV2
            previousLabel=""
            nextLabel=""
            breakLabel="..."
            initialPage={currentPage}
            forcePage={currentPage}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            pageRangeDisplayed={2}
            onPageChange={this.handlePageChange}
          />
        </span>
      </div>
    );
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
              {t("labels.announcements", { ns: "messaging" })}
            </h2>
          </div>
          {this.props.announcements.length && this.props.workspace ? (
            <div className="panel__body">
              <div className="item-list item-list--panel-announcements">
                {this.getCurrentAnnouncements().map((a) => (
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
                    {a.pinned && <span className="icon icon-pin"></span>}
                  </Link>
                ))}
              </div>
              {this.props.announcements.length > itemsPerPage
                ? renderPaginationBody
                : null}
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
