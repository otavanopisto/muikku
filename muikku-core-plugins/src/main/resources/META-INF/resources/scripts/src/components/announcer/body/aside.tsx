import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import {
  AnnouncementsType,
  AnnouncerNavigationItemType,
} from "~/reducers/announcements";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import Navigation, { NavigationElement } from "../../general/navigation";
import { NavigationTopic } from "../../general/navigation";

/**
 * NavigationAsideProps
 */
interface NavigationAsideProps {
  i18nOLD: i18nType;
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
            {navItem.text(this.props.i18nOLD)}
          </NavigationElement>
        )
      );

    return (
      <Navigation>
        <NavigationTopic
          name={this.props.i18nOLD.text.get("plugin.announcer.folders.title")}
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
    i18nOLD: state.i18nOLD,
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

export default connect(mapStateToProps, mapDispatchToProps)(NavigationAside);
