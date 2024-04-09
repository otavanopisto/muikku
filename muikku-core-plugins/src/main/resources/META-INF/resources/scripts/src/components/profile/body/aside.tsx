import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import { StateType } from "~/reducers";
import NavigationMenu, {
  NavigationElement,
} from "~/components/general/navigation";
import { StatusType } from "~/reducers/base/status";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * NavigationProps
 */
interface NavigationProps extends WithTranslation<["common"]> {
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
    const isOnlyStudentParent =
      this.props.status.roles.includes("STUDENT_PARENT") &&
      this.props.status.roles.length === 1;
    switch (hash) {
      case "security":
        return !isOnlyStudentParent;
      case "contact":
        return !isOnlyStudentParent;
      case "vacation":
        return !isOnlyStudentParent;
      case "chat":
        return (
          this.props.status.permissions.CHAT_AVAILABLE && !isOnlyStudentParent
        );
      case "work":
        return (
          !this.props.status.isStudent &&
          this.props.status.permissions.WORKLIST_AVAILABLE
        );
      case "purchases":
        return this.props.status.isStudent;
      default:
        return true;
    }
  }

  /**
   * render
   */
  render() {
    const sections = [
      {
        name: this.props.t("labels.generalInfo", { ns: "profile" }),
        hash: "general",
      },
      {
        name: this.props.t("labels.contactInfo"),
        hash: "contact",
      },
      {
        name: this.props.t("labels.signIn"),
        hash: "security",
      },
      {
        name: this.props.t("labels.vacationSettings", { ns: "profile" }),
        hash: "vacation",
      },
      {
        name: this.props.t("labels.chatSettings", { ns: "profile" }),
        hash: "chat",
      },
      {
        name: this.props.t("labels.worklist", { ns: "profile" }),
        hash: "work",
      },
      {
        name: this.props.t("labels.orders", { ns: "orders" }),
        hash: "purchases",
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

export default withTranslation(["profile"])(
  connect(mapStateToProps, mapDispatchToProps)(Navigation)
);
