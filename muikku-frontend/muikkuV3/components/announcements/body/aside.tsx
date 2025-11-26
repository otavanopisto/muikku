import * as React from "react";
import Link from "~/components/general/link";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import "~/sass/elements/label.scss";
import "~/sass/elements/item-list.scss";
import { localize } from "~/locales/i18n";
import { Announcement } from "~/generated/client";
import { useSelector } from "react-redux";
import PagerV2 from "~/components/general/pagerV2";
import { useTranslation } from "react-i18next";
import AnnouncementOptions from "../general/announcement-options";

/**
 * AnnouncementsAside
 * @returns component
 */
const AnnouncementsAside: React.FC = () => {
  const { t } = useTranslation("messaging");
  const [currentPage, setCurrentPage] = React.useState(0);
  const announcements = useSelector(
    (state: StateType) => state.announcements.announcements
  );

  const itemsPerPage = 10;
  /**
   * Calculates amount of pages
   * depends how many items there is per page
   */
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

  /**
   * renders pagination body as one of announcements list item
   */

  return (
    <>
      {announcements.length !== 0 ? (
        <>
          <div className="item-list item-list--panel-announcements">
            {paginatedAnnouncements.map((announcement: Announcement) => {
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
                  {announcement.pinnedToSelf && (
                    <span
                      title={t("labels.pinnedToSelf", { ns: "messaging" })}
                      className="icon announcement__icon--pinned-to-self icon-pin"
                    ></span>
                  )}
                  {announcement.pinned && (
                    <span className="icon icon-pin"></span>
                  )}
                  <AnnouncementOptions announcement={announcement} />
                </Link>
              );
            })}
          </div>
          {announcements.length > itemsPerPage ? renderPaginationBody : null}
        </>
      ) : (
        <div>{t("content.empty", { context: "announcements" })}</div>
      )}
    </>
  );
};

export default AnnouncementsAside;
