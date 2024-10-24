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

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation {
  announcements: AnnouncementsState;
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

    return (
      <Navigation>
        <NavigationTopic name={this.props.i18n.t("labels.folders")}>
          {navigationElementList}
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
