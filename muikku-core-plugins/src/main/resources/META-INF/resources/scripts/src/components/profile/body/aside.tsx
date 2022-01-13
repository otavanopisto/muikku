import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import NavigationMenu, {
  NavigationElement,
} from "~/components/general/navigation";
import { StatusType } from "~/reducers/base/status";

/**
 * NavigationProps
 */
interface NavigationProps {
  i18n: i18nType;
  location: string;
  status: StatusType;
}

/**
 * NavigationState
 */
interface NavigationState {}

/**
 * Navigation
 */
class Navigation extends React.Component<NavigationProps, NavigationState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NavigationProps) {
    super(props);
  }

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param hash section hash
   * @returns whether section with given hash should be visible or not
   */
  isVisible(hash: string) {
    switch (hash) {
      case "chat":
        return this.props.status.permissions.CHAT_AVAILABLE;
      case "work":
        return (
          !this.props.status.isStudent &&
          this.props.status.permissions.WORKLIST_AVAILABLE
        );
      default:
        return true;
    }
  }

  /**
   *
   */
  render() {
    const sections = [
      {
        name: this.props.i18n.text.get("plugin.profile.category.general"),
        hash: "general",
      },
      {
        name: this.props.i18n.text.get("plugin.profile.category.contact"),
        hash: "contact",
      },
      {
        name: this.props.i18n.text.get("plugin.profile.category.security"),
        hash: "security",
      },
      {
        name: this.props.i18n.text.get("plugin.profile.category.vacation"),
        hash: "vacation",
      },
      {
        name: this.props.i18n.text.get("plugin.profile.category.chat"),
        hash: "chat",
      },
      {
        name: this.props.i18n.text.get("plugin.profile.category.work"),
        hash: "work",
      },
    ];

    return (
      <NavigationMenu>
        {sections
          .filter((section) => this.isVisible(section.hash))
          .map((item, index) => (
            <NavigationElement
              isActive={this.props.location === item.hash}
              hash={item.hash}
              key={index}
            >
              {item.name}
            </NavigationElement>
          ))}
      </NavigationMenu>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    location: state.profile.location,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
