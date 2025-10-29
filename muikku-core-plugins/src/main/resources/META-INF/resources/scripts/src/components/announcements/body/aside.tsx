import * as React from "react";
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
import { Action, Dispatch } from "redux";
import { connect } from "react-redux";
import PagerV2 from "~/components/general/pagerV2";

/**
 * AnnouncementsAsideProps
 */
interface AnnouncementsAsideProps extends WithTranslation {
  announcements: AnnouncementsState;
}

/**
 * AnnouncementsAsideState
 */
interface AnnouncementsAsideState {
  currentPage: number;
  announcements: Announcement[];
  itemsPerPage: number;
}

/**
 * AnnouncementsAside
 */
class AnnouncementsAside extends React.Component<
  AnnouncementsAsideProps,
  AnnouncementsAsideState
> {
  /**
   * AnnouncementsPanelProps
   * @param props props
   */
  constructor(props: AnnouncementsAsideProps) {
    super(props);

    this.state = {
      itemsPerPage: 10,
      currentPage: 0,
      announcements: props.announcements.announcements,
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

  getCurrentAnnouncements = React.useMemo(() => {
    const { currentPage, itemsPerPage } = this.state;
    const announcements = this.props.announcements.announcements;
    const offset = currentPage * itemsPerPage;
    return announcements.slice(offset, offset + itemsPerPage);
  }, [
    this.state.currentPage,
    this.state.itemsPerPage,
    this.props.announcements.announcements,
  ]);
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { currentPage, itemsPerPage, announcements } = this.state;
    /**
     * Calculates amount of pages
     * depends how many items there is per page
     */
    const pageCount = Math.ceil(announcements.length / itemsPerPage);
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
    return (
      <>
        {this.props.announcements.announcements.length !== 0 ? (
          <>
            <div className="item-list item-list--panel-announcements">
              {this.getCurrentAnnouncements.map(
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
            {this.props.announcements.announcements.length > itemsPerPage
              ? renderPaginationBody
              : null}
          </>
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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AnnouncementsAside)
);
