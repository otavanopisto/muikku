import Link from "~/components/general/link";
import * as React from "react";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/panel.scss";
import "~/sass/elements/label.scss";
import { StateType } from "~/reducers/index";
import { useSelector } from "react-redux";
import PagerV2 from "~/components/general/pagerV2";
import { Panel } from "~/components/general/panel";
import { localize } from "~/locales/i18n";
import { useTranslation } from "react-i18next";
import { Announcement } from "~/generated/client";
import { colorIntToHex } from "~/util/modifiers";

/**
 * AnnouncementsPanelProps
 */
interface AnnouncementsPanelProps {
  overflow?: boolean;
}

/**
 * AnnouncementsPanel
 * @param props props
 * @returns component
 */
const AnnouncementsPanel: React.FC<AnnouncementsPanelProps> = (props) => {
  const { t } = useTranslation(["frontPage", "messaging"]);
  const [currentPage, setCurrentPage] = React.useState(0);
  const itemsPerPage = 10;
  const { overflow } = props;
  const { announcements, unreadCount } = useSelector((state: StateType) => ({
    announcements: state.announcements.announcements,
    unreadCount: state.announcements.unreadCount,
  }));
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
   * Gets a memoizeized page of announcements to display
   * @returns an array of announcements depending on current page and items per page
   */
  const paginatedAnnouncements = React.useMemo(() => {
    const offset = currentPage * itemsPerPage;
    return announcements.slice(offset, offset + itemsPerPage);
  }, [announcements, currentPage, itemsPerPage]);

  /**
   * Calculates amount of pages
   * depends how many items there is per page
   */

  /**
   * renders announcements
   */
  const renderAnnouncements = paginatedAnnouncements.map(
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
          } ${announcement.unread ? "item-list__item--unread" : ""}`}
          href={`/announcements#${announcement.id}`}
          to={`/announcements#${announcement.id}`}
        >
          <span className="item-list__icon item-list__icon--announcements icon-paper-plane"></span>
          <span className="item-list__text-body item-list__text-body--multiline">
            <span className="item-list__announcement-caption">
              {announcement.caption}
            </span>
            <span className="item-list__announcement-date">
              {localize.date(announcement.startDate)}
            </span>
            {announcement.categories.length !== 0 && (
              <div className="labels item-list__announcement-categories">
                {announcement.categories.map((category) => (
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
            {announcement.workspaces && announcement.workspaces.length ? (
              <div className="labels item-list__announcement-workspaces">
                <span className="label">
                  <span className="label__icon label__icon--workspace icon-books"></span>
                  <span className="label__text label__text--workspace">
                    {announcement.workspaces[0].name}{" "}
                    {announcement.workspaces[0].nameExtension
                      ? "(" + announcement.workspaces[0].nameExtension + ")"
                      : null}
                  </span>
                </span>
                {extraWorkspaces ? (
                  <span className="label">{"(+" + extraWorkspaces + ")"}</span>
                ) : null}
              </div>
            ) : null}
          </span>
          {announcement.pinned ? <span className="icon icon-pin"></span> : null}
        </Link>
      );
    }
  );

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

  return (
    <Panel
      header={t("labels.announcements", {
        ns: "messaging",
        context: "other",
      })}
      icon="icon-paper-plane"
      indicator={unreadCount > 0 ? unreadCount : null}
      modifier="announcements"
    >
      {announcements.length ? (
        <>
          <div
            className="item-list item-list--panel-announcements"
            style={overflow && { overflow: "auto" }}
          >
            {renderAnnouncements}
          </div>
          {announcements.length > itemsPerPage ? renderPaginationBody : null}
        </>
      ) : (
        <div className="empty empty--front-page">
          {t("content.empty", {
            context: "announcements",
          })}
        </div>
      )}
    </Panel>
  );
};

export default AnnouncementsPanel;
