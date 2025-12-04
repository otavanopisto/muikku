import * as React from "react";
import { connect } from "react-redux";
import {
  AnnouncementsState,
  AnnouncerNavigationItemType,
} from "~/reducers/announcements";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import Navigation, { NavigationElement } from "../../general/navigation";
import { NavigationTopic } from "../../general/navigation";
import { withTranslation, WithTranslation } from "react-i18next";
import { Action, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { colorIntToHex } from "~/util/modifiers";
import { Role } from "~/generated/client";
import DropdownComponent, {
  ItemType2,
  DropdownProps,
} from "~/components/general/dropdown";
import Link from "~/components/general/link";
import CategoryUpdateDialog from "../dialogs/category-update";
import PromptDialog from "~/components/general/prompt-dialog";
import Dropdown from "./aside/tag-dropdown";

/**
 * DropdownItem
 */
interface DropdownItem {
  id: string;
  icon: string;
  text: string;
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
  onClick?: () => void;
}

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation {
  announcements: AnnouncementsState;
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
      this.props.announcements.categories.map((category) => {
        const dropdownItems: ItemType2[] = [
          (closeDropdown) => (
            <CategoryUpdateDialog category={category} onClose={closeDropdown}>
              <Link
                key="edit-category"
                className="link link--full link--announcement-category-dropdown"
              >
                <span className="link__icon icon-pencil"></span>
                <span>{this.props.t("labels.edit", { ns: "messaging" })}</span>
              </Link>
            </CategoryUpdateDialog>
          ),
          (closeDropdown) => (
            <PromptDialog
              key="remove-category-dialog"
              title="ASDASDASD"
              content="ASDASDASD"
              onExecute={() => console.log("Delete")}
            >
              <Link
                key="remove-category"
                className="link link--full link--announcement-category-dropdown"
              >
                <span className="link__icon icon-trash"></span>
                <span>
                  {this.props.t("labels.remove", { ns: "messaging" })}
                </span>
              </Link>
            </PromptDialog>
          ),
        ];

        return (
          <NavigationElement
            key={category.id}
            isActive={
              this.props.announcements.location === `category-${category.id}`
            }
            hash={`category-${category.id}`}
            icon="tag"
            editableIcon="more_vert"
            editableWrapper={Dropdown}
            editableWrapperArgs={{
              category: category,
            }}
            isEditable={this.props.roles.includes("ADMINISTRATOR")}
            iconColor={colorIntToHex(category.color)}
          >
            {category.category}
          </NavigationElement>
        );
      });
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
  return {};
}

export default withTranslation("messaging")(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
