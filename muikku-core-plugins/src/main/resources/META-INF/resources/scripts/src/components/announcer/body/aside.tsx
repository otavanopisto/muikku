import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import {
  AnnouncementsType,
  AnnouncerNavigationItemType,
} from "~/reducers/announcements";
import { StateType } from "~/reducers";

import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import Navigation, { NavigationElement } from "../../general/navigation";
import { NavigationTopic } from "../../general/navigation";

interface NavigationAsideProps {
  i18n: i18nType;
  announcements: AnnouncementsType;
}

interface NavigationAsideState {}

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
            {navItem.text(this.props.i18n)}
          </NavigationElement>
        )
      );

    return (
      <Navigation>
        <NavigationTopic
          name={this.props.i18n.text.get("plugin.announcer.folders.title")}
        >
          {navigationElementList}
        </NavigationTopic>
      </Navigation>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    announcements: state.announcements,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(NavigationAside);
