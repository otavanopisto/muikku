import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { StateType } from "~/reducers";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import { filterMatch, filterHighlight, colorIntToHex } from "~/util/modifiers";
import { AnnouncementsState } from "~/reducers/announcements";
import DeleteAnnouncementDialog from "../../dialogs/delete-announcement";
import NewEditAnnouncement from "../../dialogs/new-edit-announcement";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
  ApplicationPanelToolbarActionsAside,
} from "~/components/general/application-panel/application-panel";
import { ButtonPill } from "~/components/general/button";
import {
  markAllAsRead,
  LoadAnnouncementsTriggerType,
  updateAnnouncement,
  updateSelectedAnnouncementCategories,
  UpdateSelectedAnnouncementCategoryTriggerType,
  UpdateAnnouncementTriggerType,
  RemoveFromAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected,
  createAnnouncementCategory,
  CreateAnnouncementCategoryTriggerType,
} from "~/actions/announcements";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import { Announcement, Role } from "~/generated/client";

/**
 * AnnouncerToolbarProps
 */
interface AnnouncerToolbarProps extends WithTranslation {
  announcements: AnnouncementsState;
  roles: Role[];
  createAnnouncementCategory: CreateAnnouncementCategoryTriggerType;
  updateAnnouncement: UpdateAnnouncementTriggerType;
  markAllAsRead: LoadAnnouncementsTriggerType;
  removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType;
  updateSelectedAnnouncementCategories: UpdateSelectedAnnouncementCategoryTriggerType;
}

/**
 * AnnouncerToolbarState
 */
interface AnnouncerToolbarState {
  category: string;
}
/**
 * AnnouncerToolbar
 */
class AnnouncerToolbar extends React.Component<
  AnnouncerToolbarProps,
  AnnouncerToolbarState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: AnnouncerToolbarProps) {
    super(props);
    this.go = this.go.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
    this.restoreCurrentAnnouncement =
      this.restoreCurrentAnnouncement.bind(this);
    this.restoreSelectedAnnouncements =
      this.restoreSelectedAnnouncements.bind(this);
    this.markAllAsRead = this.markAllAsRead.bind(this);
    this.onUpdateCategory = this.onUpdateCategory.bind(this);
    this.onCreateNewCategory = this.onCreateNewCategory.bind(this);
    this.state = {
      category: "",
    };
  }

  /**
   * onUpdateCategory
   * @param e event
   */
  onUpdateCategory(e: React.ChangeEvent<HTMLInputElement>) {
    const category = e.target.value;
    this.setState({ category });
  }

  /**
   * onCreateNewLabel
   */
  onCreateNewCategory() {
    this.props.createAnnouncementCategory({
      category: this.state.category,
    });
  }

  /**
   * markAllAsRead
   */
  markAllAsRead() {
    this.props.markAllAsRead(
      this.props.announcements.location,
      this.props.announcements.workspaceId,
      false,
      true
    );
  }

  /**
   * restoreCurrentAnnouncement
   */
  restoreCurrentAnnouncement() {
    this.props.updateAnnouncement({
      announcement: this.props.announcements.current,
      update: {
        archived: false,
      },
    });
  }

  /**
   * restoreSelectedAnnouncements
   */
  restoreSelectedAnnouncements() {
    this.props.announcements.selected.map((announcement) => {
      this.props.updateAnnouncement({
        announcement,
        update: {
          archived: false,
        },
        cancelRedirect: true,
      });
      this.props.removeFromAnnouncementsSelected(announcement);
    });
  }

  /**
   * go
   * @param announcement announcement
   */
  go(announcement: Announcement) {
    if (!announcement) {
      return;
    }

    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState) {
      history.replaceState(
        "",
        "",
        location.hash.split("/")[0] + "/" + announcement.id
      );
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + announcement.id;
    }
  }

  /**
   * onGoBackClick
   */
  onGoBackClick() {
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState) {
      const canGoBack =
        document.referrer.indexOf(window.location.host) !== -1 &&
        history.length;
      if (canGoBack) {
        history.back();
      } else {
        history.replaceState("", "", location.hash.split("/")[0]);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = location.hash.split("/")[0];
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (this.props.announcements.current) {
      //TODO this should be done more efficiently but the information is not included in the announcement
      //this is why we had to have notOverrideCurrent in the reducers, it's such a mess
      const currentIndex: number =
        this.props.announcements.announcements.findIndex(
          (a: Announcement) => a.id === this.props.announcements.current.id
        );
      let next: Announcement = null;
      let prev: Announcement = null;

      if (currentIndex !== -1) {
        next = this.props.announcements.announcements[currentIndex + 1];
        prev = this.props.announcements.announcements[currentIndex - 1];
      }

      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <ButtonPill
              buttonModifiers="go-back"
              icon="back"
              onClick={this.onGoBackClick}
              data-de-aria-key="b"
              data-de-aria-horizontal-alignment="end-outside"
              data-de-aria-vertical-alignment="middle"
            />

            <div
              className="application-panel__mobile-current-folder"
              data-de-aria-text="true"
              tabIndex={0}
              role="text"
            >
              <span className="application-panel__mobile-current-folder-icon icon-folder"></span>
              <span className="application-panel__mobile-current-folder-title">
                {this.props.i18n.t("labels.category", {
                  context: this.props.announcements.location,
                  ns: "messaging",
                })}
              </span>
            </div>

            <NewEditAnnouncement
              announcement={this.props.announcements.current}
            >
              <ButtonPill
                buttonModifiers="edit"
                icon="pencil"
                data-de-aria-key="e"
                data-de-aria-horizontal-alignment="end-outside"
                data-de-aria-vertical-alignment="middle"
              />
            </NewEditAnnouncement>
            {/* Delete announcement button is hidden in archived folder as backend does not support the feature yet */}
            {this.props.announcements.location !== "archived" ? (
              <DeleteAnnouncementDialog
                announcement={this.props.announcements.current}
                onDeleteAnnouncementSuccess={this.onGoBackClick}
              >
                <ButtonPill
                  buttonModifiers="delete"
                  icon="trash"
                  data-de-aria-key="d"
                  data-de-aria-horizontal-alignment="end-outside"
                  data-de-aria-vertical-alignment="middle"
                />
              </DeleteAnnouncementDialog>
            ) : null}
            {this.props.announcements.location === "archived" ? (
              <ButtonPill
                buttonModifiers="restore"
                icon="undo"
                onClick={this.restoreCurrentAnnouncement}
                data-de-aria-key="r"
                data-de-aria-horizontal-alignment="end-outside"
                data-de-aria-vertical-alignment="middle"
              />
            ) : null}
          </ApplicationPanelToolbarActionsMain>
          <ApplicationPanelToolbarActionsAside>
            <ButtonPill
              buttonModifiers="prev-page"
              disabled={!prev}
              onClick={this.go.bind(this, prev)}
              icon="arrow-left"
              data-de-aria-key="p"
              data-de-aria-horizontal-alignment="end-outside"
              data-de-aria-vertical-alignment="middle"
            />
            <ButtonPill
              buttonModifiers="next-page"
              disabled={!next}
              onClick={this.go.bind(this, next)}
              icon="arrow-right"
              data-de-aria-key="n"
              data-de-aria-horizontal-alignment="end-outside"
              data-de-aria-vertical-alignment="middle"
            />
          </ApplicationPanelToolbarActionsAside>
        </ApplicationPanelToolbar>
      );
    } else {
      const isAtLeastOneSelected = this.props.announcements.selected.length > 0;
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <div
              className="application-panel__mobile-current-folder"
              data-de-aria-text="true"
              tabIndex={0}
              role="text"
            >
              <span className="glyph application-panel__mobile-current-folder-icon icon-folder"></span>
              <span className="application-panel__mobile-current-folder-title">
                {this.props.i18n.t("labels.category", {
                  context: this.props.announcements.location,
                  ns: "messaging",
                })}
              </span>
            </div>
            {/* Delete announcement button is hidden in archived folder as backend does not support the feature yet */}
            {this.props.announcements.location !== "archived" ? (
              <DeleteAnnouncementDialog>
                <ButtonPill
                  buttonModifiers="delete"
                  disabled={this.props.announcements.selected.length === 0}
                  icon="trash"
                  data-de-aria-key="d"
                  data-de-aria-horizontal-alignment="end-outside"
                  data-de-aria-vertical-alignment="middle"
                />
              </DeleteAnnouncementDialog>
            ) : null}
            {this.props.announcements.location === "archived" ? (
              <ButtonPill
                buttonModifiers="restore"
                icon="undo"
                disabled={this.props.announcements.selected.length === 0}
                onClick={this.restoreSelectedAnnouncements}
                data-de-aria-key="r"
                data-de-aria-horizontal-alignment="end-outside"
                data-de-aria-vertical-alignment="middle"
              />
            ) : null}
            <ButtonPill
              buttonModifiers="mark-all-read"
              icon="envelope-open"
              disabled={this.props.announcements.unreadCount === 0}
              onClick={this.markAllAsRead}
              data-de-aria-key="m"
              data-de-aria-horizontal-alignment="end-outside"
              data-de-aria-vertical-alignment="middle"
            />
            {this.props.roles.includes("ADMINISTRATOR") && (
              <Dropdown
                modifier="announcer-labels"
                items={[
                  <div
                    key="update-label"
                    className="form-element form-element--new-label"
                  >
                    <input
                      className="form-element__input"
                      value={this.state.category}
                      onChange={this.onUpdateCategory}
                      type="text"
                      data-de-aria-key="c"
                      data-de-aria-horizontal-alignment="end-outside"
                      data-de-aria-vertical-alignment="middle"
                      placeholder={this.props.i18n.t(
                        "labels.createAndSearchCategories",
                        { ns: "messaging" }
                      )}
                    />
                  </div>,
                  <Link
                    key="new-link"
                    tabIndex={0}
                    className="link link--full link--new"
                    onClick={this.onCreateNewCategory}
                    data-de-aria-key="c"
                    data-de-aria-horizontal-alignment="end-outside"
                    data-de-aria-vertical-alignment="middle"
                  >
                    {this.props.i18n.t("actions.create", {
                      ns: "messaging",
                      context: "category",
                    })}
                  </Link>,
                ].concat(
                  this.props.announcements.categories
                    .filter((item) =>
                      filterMatch(item.category, this.state.category)
                    )
                    .map((category) => {
                      const categoryInSelectedCount =
                        this.props.announcements.selected.reduce(
                          (count, selected) =>
                            selected.categories.some(
                              (c) => c.id === category.id
                            )
                              ? count + 1
                              : count,
                          0
                        );
                      const isSelected = this.props.announcements.selected.find(
                        (selected) =>
                          selected.categories.some((c) => c.id === category.id)
                      );
                      const isPartiallySelected =
                        this.props.announcements.selected.length >
                          categoryInSelectedCount &&
                        categoryInSelectedCount > 0;

                      return (
                        <Link
                          key={category.id}
                          tabIndex={0}
                          className={`link link--full link--communicator-label-dropdown ${
                            isSelected ? "selected" : ""
                          } ${isPartiallySelected ? "semi-selected" : ""} ${
                            isAtLeastOneSelected ? "" : "disabled"
                          }`}
                          onClick={() =>
                            this.props.updateSelectedAnnouncementCategories(
                              category
                            )
                          }
                          data-de-aria-key="l"
                          data-de-aria-horizontal-alignment="end-outside"
                          data-de-aria-vertical-alignment="middle"
                        >
                          <span
                            className="link__icon icon-tag"
                            style={{ color: colorIntToHex(category.color) }}
                          ></span>
                          <span className="link__text">
                            {filterHighlight(
                              category.category,
                              this.state.category
                            )}
                          </span>
                        </Link>
                      );
                    })
                )}
              >
                <ButtonPill
                  buttonModifiers="label"
                  icon="tag"
                  data-de-aria-key="l"
                  data-de-aria-horizontal-alignment="end-outside"
                  data-de-aria-vertical-alignment="middle"
                />
              </Dropdown>
            )}
          </ApplicationPanelToolbarActionsMain>
        </ApplicationPanelToolbar>
      );
    }
  }
}

//TODO this is another one that uses the different version of announcements

/**
 * mapStateToProps - TODO this is another one that uses the different version of announcements
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    announcements: state.announcements,
    roles: state.status.roles,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateAnnouncement,
      removeFromAnnouncementsSelected,
      markAllAsRead,
      createAnnouncementCategory,
      updateSelectedAnnouncementCategories,
    },
    dispatch
  );
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AnnouncerToolbar)
);
