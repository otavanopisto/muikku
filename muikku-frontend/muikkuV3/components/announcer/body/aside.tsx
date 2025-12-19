import * as React from "react";
import { connect } from "react-redux";
import {
  AnnouncementsState,
  AnnouncerNavigationItemType,
} from "~/reducers/announcements";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import Navigation, {
  NavigationTopic,
  NavigationElement,
  NavigationDropdown,
  DropdownWrapperProps,
} from "../../general/navigation";

import { GenericTag } from "~/components/general/tag-update-dialog";

import { withTranslation, WithTranslation } from "react-i18next";
import { Action, Dispatch, bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { colorIntToHex } from "~/util/modifiers";
import { Role, AnnouncementCategory } from "~/generated/client";
import {
  deleteAnnouncementCategory,
  DeleteAnnouncementCategoryTriggerType,
  updateAnnouncementCategory,
  UpdateAnnouncementCategoryTriggerType,
} from "~/actions/announcements";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation {
  announcements: AnnouncementsState;
  updateAnnouncementCategory: UpdateAnnouncementCategoryTriggerType;
  deleteAnnouncementCategory: DeleteAnnouncementCategoryTriggerType;
  roles: Role[];
}

/**
 * NavigationAsideState
 */
interface NavigationAsideState {}

/**
 * NavigationAside
 */
class NavigationAside extends React.Component<
  NavigationAsideProps,
  NavigationAsideState
> {
  /**
   * Handles delete category
   * @param tag tag to be deleted
   */
  handleDelete = (tag: GenericTag) => {
    this.props.deleteAnnouncementCategory(tag.id);
  };

  /**
   * Handles update category
   * @param tag tag to be updated
   * @param success success callback
   * @param fail fail callback
   */
  handleUpdate = (tag: GenericTag, success?: () => void, fail?: () => void) => {
    const data = {
      id: tag.id,
      category: tag.label,
      color: tag.color,
      success: success,
      fail: fail,
    };
    this.props.updateAnnouncementCategory(data);
  };

  /**
   * Translates category to a generic tag
   * @param category announcement category
   * @returns a generic Tag
   */
  translateCategoryToGenericTag = (
    category: AnnouncementCategory
  ): GenericTag => ({
    id: category.id,
    label: category.category,
    color: category.color,
  });

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const navigationElementList: JSX.Element[] =
      this.props.announcements.navigation.map(
        (navItem: AnnouncerNavigationItemType) => (
          <NavigationElement
            key={navItem.id}
            isActive={this.props.announcements.location === navItem.location}
            hash={navItem.location}
            icon={navItem.icon}
          >
            {this.props.t("labels.category", {
              ns: "messaging",
              context: navItem.text,
            })}
          </NavigationElement>
        )
      );

    const categoryElementList: JSX.Element[] =
      this.props.announcements.categories.map((category) => (
        <NavigationElement
          key={category.id}
          isActive={
            this.props.announcements.location === `category-${category.id}`
          }
          hash={`category-${category.id}`}
          icon="tag"
          editableIcon="more_vert"
          editableWrapper={NavigationDropdown}
          editableWrapperArgs={
            {
              tag: this.translateCategoryToGenericTag(category),
              onDelete: this.handleDelete,
              onUpdate: this.handleUpdate,
              deleteDialogTitle: this.props.t("labels.remove", {
                ns: "messaging",
                context: "category",
              }),
              deleteDialogContent: this.props.t("content.removing", {
                ns: "messaging",
                context: "category",
              }),
              updateDialogTitle: this.props.t("labels.edit", {
                ns: "messaging",
                context: "category",
              }),
              editLabel: this.props.t("labels.edit"),
              deleteLabel: this.props.t("labels.remove"),
            } satisfies DropdownWrapperProps
          }
          isEditable={this.props.roles.includes("ADMINISTRATOR")}
          iconColor={colorIntToHex(category.color)}
        >
          {category.category}
        </NavigationElement>
      ));

    return (
      <Navigation>
        <NavigationTopic name={this.props.i18n.t("labels.folders")}>
          {navigationElementList}
        </NavigationTopic>
        <NavigationTopic name={this.props.i18n.t("labels.categories")}>
          {categoryElementList}
        </NavigationTopic>
      </Navigation>
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
      updateAnnouncementCategory,
      deleteAnnouncementCategory,
    },
    dispatch
  );
}

export default withTranslation("messaging")(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
