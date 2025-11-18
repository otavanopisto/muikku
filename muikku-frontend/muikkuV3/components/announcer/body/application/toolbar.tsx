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
import { filterMatch, filterHighlight } from "~/util/modifiers";
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
  UpdateAnnouncementTriggerType,
  RemoveFromAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected,
  createAnnouncementCategory,
  CreateAnnouncementCategoryTriggerType,
} from "~/actions/announcements";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import { Announcement } from "~/generated/client";

/**
 * AnnouncerToolbarProps
 */
interface AnnouncerToolbarProps extends WithTranslation {
  announcements: AnnouncementsState;
  createAnnouncementCategory: CreateAnnouncementCategoryTriggerType;
  updateAnnouncement: UpdateAnnouncementTriggerType;
  markAllAsRead: LoadAnnouncementsTriggerType;
  removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType;
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
            />

            <div className="application-panel__mobile-current-folder">
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
              <ButtonPill buttonModifiers="edit" icon="pencil" />
            </NewEditAnnouncement>
            {/* Delete announcement button is hidden in archived folder as backend does not support the feature yet */}
            {this.props.announcements.location !== "archived" ? (
              <DeleteAnnouncementDialog
                announcement={this.props.announcements.current}
                onDeleteAnnouncementSuccess={this.onGoBackClick}
              >
                <ButtonPill buttonModifiers="delete" icon="trash" />
              </DeleteAnnouncementDialog>
            ) : null}
            {this.props.announcements.location === "archived" ? (
              <ButtonPill
                buttonModifiers="restore"
                icon="undo"
                onClick={this.restoreCurrentAnnouncement}
              />
            ) : null}
          </ApplicationPanelToolbarActionsMain>
          <ApplicationPanelToolbarActionsAside>
            <ButtonPill
              buttonModifiers="prev-page"
              disabled={!prev}
              onClick={this.go.bind(this, prev)}
              icon="arrow-left"
            />
            <ButtonPill
              buttonModifiers="next-page"
              disabled={!next}
              onClick={this.go.bind(this, next)}
              icon="arrow-right"
            />
          </ApplicationPanelToolbarActionsAside>
        </ApplicationPanelToolbar>
      );
    } else {
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <div className="application-panel__mobile-current-folder">
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
                />
              </DeleteAnnouncementDialog>
            ) : null}
            {this.props.announcements.location === "archived" ? (
              <ButtonPill
                buttonModifiers="restore"
                icon="undo"
                disabled={this.props.announcements.selected.length === 0}
                onClick={this.restoreSelectedAnnouncements}
              />
            ) : null}
            <ButtonPill
              buttonModifiers="mark-all-read"
              icon="envelope-open"
              disabled={this.props.announcements.unreadCount === 0}
              onClick={this.markAllAsRead}
            />
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
                    placeholder={this.props.i18n.t(
                      "labels.createAndSearchLabels",
                      { ns: "messaging" }
                    )}
                  />
                </div>,
                <Link
                  key="new-link"
                  tabIndex={0}
                  className="link link--full link--new"
                  onClick={this.onCreateNewCategory}
                >
                  {this.props.i18n.t("actions.create", {
                    ns: "messaging",
                    context: "category",
                  })}
                </Link>,
              ].concat(
                this.props.announcements.navigation
                  .filter(
                    (item) =>
                      item.type === "category" &&
                      filterMatch(item.text, this.state.category)
                  )
                  .map((category) => {
                    const isSelected = true; //TODO check if label is selected
                    return (
                      <Link
                        key={category.id}
                        tabIndex={0}
                        className={`link link--full link--communicator-label-dropdown ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={
                          !isSelected
                            ? this.props.addLabelToCurrentMessageThread.bind(
                                null,
                                category
                              )
                            : this.props.removeLabelFromCurrentMessageThread.bind(
                                null,
                                category
                              )
                        }
                      >
                        <span
                          className="link__icon icon-tag"
                          style={{ color: category.color }}
                        ></span>
                        <span className="link__text">
                          {filterHighlight(category.text, this.state.category)}
                        </span>
                      </Link>
                    );
                  })
              )}
            >
              <ButtonPill buttonModifiers="label" icon="tag" />
            </Dropdown>
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
    },
    dispatch
  );
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AnnouncerToolbar)
);
