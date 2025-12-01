import * as React from "react";
import { localize } from "~/locales/i18n";
import { useSelector } from "react-redux";
import Link from "~/components/general/link";
import { StateType } from "~/reducers";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";
import PagerV2 from "~/components/general/pagerV2";
import { useTranslation } from "react-i18next";
import { colorIntToHex } from "~/util/modifiers";

import AnnouncementOptions from "~/components/announcements/general/announcement-options";
/**
 *
 * WorkspaceAnnouncements
 * @returns component
 */
const WorkspaceAnnouncements: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const { t } = useTranslation(["workspace", "messaging"]);
  const itemsPerPage = 10;
  const { announcements, unreadCount, status, workspace } = useSelector(
    (state: StateType) => ({
      announcements: state.announcements.announcements,
      unreadCount: state.announcements.unreadCount,
      status: state.status,
      workspace: state.workspaces.currentWorkspace,
    })
  );
  const pageCount = Math.ceil(announcements.length / itemsPerPage);

  /**
   * handles page changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected);
  };

  /**
   * Gets the current announcements to display
   * @returns an array of announcements depending on current page and items per page
   */
  const paginatedAnnouncements = React.useMemo(() => {
    const offset = currentPage * itemsPerPage;
    return announcements.slice(offset, offset + itemsPerPage);
  }, [announcements, currentPage, itemsPerPage]);

  /**
   * renders pagination body as one of announcements list item
   */
  const renderPaginationBody = (
    <div
      className="item-list__item item-list__item--announcements"
      aria-label={t("wcag.pager", { ns: "messaging" })}
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
          onPageChange={handlePageChange}
        />
      </span>
    </div>
  );

  if (
    status.loggedIn &&
    status.isActiveUser &&
    status.permissions.WORKSPACE_LIST_WORKSPACE_ANNOUNCEMENTS
  ) {
    return (
      <div className="panel panel--workspace-announcements">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--workspace-announcements icon-paper-plane"></div>
          <h2 className="panel__header-title">
            {t("labels.announcement", { ns: "messaging" })}
            {unreadCount > 0 && (
              <span className="indicator indicator--panel-header">
                {unreadCount}
              </span>
            )}
          </h2>
        </div>
        {announcements.length && workspace ? (
          <div className="panel__body">
            <div className="item-list item-list--panel-announcements">
              {paginatedAnnouncements.map((a) => (
                <Link
                  to={
                    status.contextPath +
                    "/workspace/" +
                    workspace.urlName +
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
                      {a.pinned && <span className="icon icon-pin"></span>}
                      {a.pinnedToSelf && (
                        <span
                          title={t("labels.pinnedToSelf", { ns: "messaging" })}
                          className="icon announcement__icon--pinned-to-self icon-pin"
                        ></span>
                      )}
                      {a.caption}
                    </span>
                    <span className="item-list__announcement-date">
                      {localize.date(a.startDate)}
                    </span>
                    {a.categories.length !== 0 && (
                      <div className="labels item-list__announcement-categories">
                        {a.categories.map((category) => (
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
                      </div>
                    )}
                  </span>

                  <AnnouncementOptions announcement={a} />
                </Link>
              ))}
            </div>
            {announcements.length > itemsPerPage ? renderPaginationBody : null}
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
};

export default WorkspaceAnnouncements;
