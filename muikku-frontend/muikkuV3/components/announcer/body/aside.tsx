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

/**
 * DropdownItem
 */
interface DropdownItem {
  id: string;
  icon: string;
  text: string;
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
  private items: DropdownItem[] = [
    {
      id: "edit-category",
      icon: "pencil",
      text: this.props.t("labels.edit"),
      onClick: () => console.log("Edit"),
    },
    {
      id: "remove-category",
      icon: "trash",
      text: this.props.t("labels.remove"),
      onClick: () => console.log("remove"),
    },
  ];

  createDropdownItems = (items: DropdownItem[]): ItemType2[] =>
    // eslint-disable-next-line react/display-name
    items.map((item) => (onClose) => (
      <Link
        key={item.id}
        className="link link--full link--announcer-navigation link--profile-dropdown"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onClick={() => {
          onClose();
          item.onClick && item.onClick();
        }}
      >
        <span className={`link__icon icon-${item.icon}`}></span>
        <span>{item.text}</span>
      </Link>
    ));

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
          editableWrapper={DropdownComponent}
          editableWrapperArgs={
            {
              items: this.createDropdownItems(this.items),
            } as Partial<DropdownProps>
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
  return {};
}

export default withTranslation("messaging")(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
