import Link from "~/components/general/link";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/panel.scss";
import "~/sass/elements/label.scss";
import { StateType } from "~/reducers/index";
import { connect } from "react-redux";
import PagerV2 from "~/components/general/pagerV2";
import { Panel } from "~/components/general/panel";
import { Announcement } from "~/generated/client";

/**
 * AnnouncementsPanelProps
 */
interface AnnouncementsPanelProps {
  i18n: i18nType;
  status: StatusType;
  announcements: Announcement[];
  overflow?: boolean;
}

/**
 * AnnouncementsPanelState
 */
interface AnnouncementsPanelState {
  currentPage: number;
  announcements: Announcement[];
  itemsPerPage: number;
}

/**
 * AnnouncementsPanel
 */
class AnnouncementsPanel extends React.Component<
  AnnouncementsPanelProps,
  AnnouncementsPanelState
> {
  /**
   * AnnouncementsPanelProps
   * @param props props
   */
  constructor(props: AnnouncementsPanelProps) {
    super(props);

    this.state = {
      itemsPerPage: 10,
      currentPage: 0,
      announcements: props.announcements,
    };
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: AnnouncementsPanelProps) {
    if (
      JSON.stringify(prevProps.announcements) !==
      JSON.stringify(this.props.announcements)
    ) {
      this.setState({
        announcements: this.props.announcements,
      });
    }
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
   * Creates aria-label for a tags depending if link is selected
   * or not
   * @param index link index
   * @param selected if selected
   * @returns label with correct locale string
   */
  handleAriaLabelBuilder = (index: number, selected: boolean): string => {
    let label = this.props.i18n.text.get("plugin.wcag.pager.goToPage.label");

    if (selected) {
      label = this.props.i18n.text.get("plugin.wcag.pager.current.label");
    }

    return label;
  };

  /**
   * render
   */
  render() {
    const { announcements, currentPage, itemsPerPage } = this.state;

    const offset = currentPage * itemsPerPage;

    /**
     * Defines current announcements that will be mapped
     */
    const currentAnnouncements = announcements.slice(
      offset,
      offset + itemsPerPage
    );

    /**
     * Calculates amount of pages
     * depends how many items there is per page
     */
    const pageCount = Math.ceil(announcements.length / itemsPerPage);

    /**
     * renders announcements
     */
    const renderAnnouncements = currentAnnouncements.map(
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
            href={`/announcements#${announcement.id}`}
            to={`/announcements#${announcement.id}`}
          >
            <span className="item-list__icon item-list__icon--announcements icon-paper-plane"></span>
            <span className="item-list__text-body item-list__text-body--multiline">
              <span className="item-list__announcement-caption">
                {announcement.caption}
              </span>
              <span className="item-list__announcement-date">
                {this.props.i18n.time.format(announcement.startDate)}
              </span>
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
    );

    /**
     * renders pagination body as one of announcements list item
     */
    const renderPaginationBody = (
      <div
        className="item-list__item item-list__item--announcements"
        aria-label={this.props.i18n.text.get("plugin.wcag.pager.label")}
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
      <Panel
        header={this.props.i18n.text.get(
          "plugin.frontPage.announcements.title"
        )}
        icon="icon-paper-plane"
        modifier="announcements"
      >
        {this.props.announcements.length ? (
          <>
            <div
              className="item-list item-list--panel-announcements"
              style={this.props.overflow && { overflow: "auto" }}
            >
              {renderAnnouncements}
            </div>
            {this.props.announcements.length > itemsPerPage
              ? renderPaginationBody
              : null}
          </>
        ) : (
          <div
            className="empty empty--front-page"
            aria-label={this.props.i18n.text.get(
              "plugin.frontPage.announcementPanel.ariaLabel.announcement.panel"
            )}
          >
            {this.props.i18n.text.get(
              "plugin.frontPage.announcements.noAnnouncements"
            )}
          </div>
        )}
      </Panel>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
    announcements: state.announcements.announcements,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AnnouncementsPanel);
