import * as React from "react";
import { connect, Dispatch } from "react-redux";
import {
  AnnouncementsType,
  AnnouncerNavigationItemType,
} from "~/reducers/announcements";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import Navigation, { NavigationElement } from "../../general/navigation";
import { NavigationTopic } from "../../general/navigation";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps extends WithTranslation {
  announcements: AnnouncementsType;
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
   * @returns
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
            {navItem.text}
          </NavigationElement>
        )
      );

    return (
      <Navigation>
        <NavigationTopic
          name={this.props.i18n.t("labels.folders", { count: 0 })}
        >
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
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default withTranslation("messaging")(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
