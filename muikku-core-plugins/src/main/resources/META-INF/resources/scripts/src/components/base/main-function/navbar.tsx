import Navbar from "~/components/general/navbar";
import LoginButton from "../login-button";
import ForgotPasswordDialog from "../forgot-password-dialog";
import Dropdown from "~/components/general/dropdown";
import * as React from "react";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import "~/sass/elements/link.scss";
import "~/sass/elements/indicator.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import { Dependant } from "~/reducers/main-function/dependants";
import { Action, Dispatch } from "redux";
import Link from "~/components/general/link";

/**
 * ItemDataElement
 */
interface ItemDataElement {
  modifier: string;
  trail: string;
  text: string;
  href: string;
  to?: boolean;
  icon: string;
  condition?: boolean;
  badge?: number;
  openInNewTab?: string;
}

/**
 * MainFunctionNavbarProps
 */
interface MainFunctionNavbarProps extends WithTranslation {
  activeTrail?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation?: React.ReactElement<any>;
  status: StatusType;
  messageCount: number;
  title: string;
  dependants: Dependant[];
}

/**
 * MainFunctionNavbarState
 */
interface MainFunctionNavbarState {}

/**
 * MainFunctionNavbar
 */
class MainFunctionNavbar extends React.Component<
  MainFunctionNavbarProps,
  MainFunctionNavbarState
> {
  /**
   * render
   */
  render() {
    const { t } = this.props;

    const itemData: ItemDataElement[] = [
      {
        modifier: "home",
        trail: "index",
        text: t("labels.home"),
        href: "/",
        icon: "home",
        to: this.props.status.loggedIn,
        condition: true,
      },
      {
        modifier: "coursepicker",
        trail: "coursepicker",
        text: t("labels.coursepicker"),
        href: "/coursepicker",
        icon: "books",
        to: true,
        condition: true,
      },
      {
        modifier: "communicator",
        trail: "communicator",
        text: t("labels.communicator"),
        href: "/communicator",
        icon: "envelope",
        condition: this.props.status.isActiveUser && this.props.status.loggedIn,
        to: true,
        badge: this.props.messageCount,
      },
      {
        modifier: "guider",
        trail: "guider",
        text: t("labels.guider"),
        href: "/guider",
        icon: "users",
        to: true,
        condition: this.props.status.permissions.GUIDER_VIEW,
      },
      {
        modifier: "records",
        trail: "records",
        text: t("labels.studies"),
        href: "/records",
        icon: "profile",
        to: true,
        condition: this.props.status.permissions.TRANSCRIPT_OF_RECORDS_VIEW,
      },
      {
        modifier: "hops",
        trail: "hops",
        text: "Hops",
        href: "/hops",
        icon: "compass",
        to: true,
        condition: this.props.status.permissions.TRANSCRIPT_OF_RECORDS_VIEW,
      },
      {
        modifier: "hops",
        trail: "guardian_hops",
        text: "Hops",
        href: "/guardian_hops",
        icon: "compass",
        to: true,
        condition: this.props.status.permissions.GUARDIAN_VIEW,
      },
      {
        modifier: "guardian",
        trail: "guardian",
        text: t("labels.dependant", { count: this.props.dependants.length }),
        href: "/guardian",
        icon: "users",
        to: true,
        condition: this.props.status.permissions.GUARDIAN_VIEW,
      },
      {
        modifier: "announcer",
        trail: "announcer",
        text: t("labels.announcer"),
        href: "/announcer",
        icon: "paper-plane",
        to: true,
        condition: this.props.status.permissions.ANNOUNCER_TOOL,
      },
      {
        modifier: "evaluation",
        trail: "evaluation",
        text: t("labels.evaluation"),
        href: "/evaluation",
        icon: "evaluate",
        to: true,
        condition: this.props.status.permissions.EVALUATION_VIEW_INDEX,
      },
      {
        modifier: "organization",
        trail: "organization",
        text: t("labels.organizationManagament"),
        href: "/organization",
        icon: "board",
        to: true,
        condition: this.props.status.permissions.ORGANIZATION_VIEW,
      },
    ];

    return (
      <Navbar
        mobileTitle={this.props.title}
        isProfileContainedInThisApp={true}
        modifier="main-function"
        navigation={this.props.navigation}
        navbarItems={itemData.map((item, i) => {
          if (!item.condition) {
            return null;
          }
          return {
            modifier: item.modifier,
            item: (
              <Dropdown openByHover key={item.text + i} content={item.text}>
                <Link
                  openInNewTab={item.openInNewTab}
                  as={this.props.activeTrail == item.trail ? "span" : null}
                  href={
                    this.props.activeTrail !== item.trail ? item.href : null
                  }
                  to={
                    item.to && this.props.activeTrail !== item.trail
                      ? item.href
                      : null
                  }
                  className={`link link--icon link--full link--main-function-navbar ${
                    this.props.activeTrail === item.trail ? "active" : ""
                  }`}
                  aria-label={
                    this.props.activeTrail == item.trail
                      ? t("wcag.currentPage") + " " + item.text
                      : item.text
                  }
                  role="menuitem"
                >
                  <span className={`link__icon icon-${item.icon}`} />
                  {item.badge ? (
                    <span className="indicator indicator--main-function">
                      {item.badge >= 100 ? "99+" : item.badge}
                    </span>
                  ) : null}
                </Link>
              </Dropdown>
            ),
          };
        })}
        defaultOptions={
          this.props.status.loggedIn
            ? null
            : [
                <LoginButton modifier="login-main-function" key="0" />,
                <ForgotPasswordDialog key="1">
                  <Link
                    className="link link--forgot-password link--forgot-password-main-function"
                    aria-label={t("labels.forgotPasswordLink")}
                    role="menuitem"
                  >
                    <span>{t("labels.forgotPasswordLink")}</span>
                  </Link>
                </ForgotPasswordDialog>,
              ]
        }
        menuItems={itemData.map((item: ItemDataElement) => {
          if (!item.condition) {
            return null;
          }
          return (
            <Link
              key={item.modifier}
              openInNewTab={item.openInNewTab}
              to={item.to ? item.href : null}
              href={item.href}
              className={`menu__item-link ${
                this.props.activeTrail === item.trail ? "active" : ""
              }`}
              aria-label={item.text}
              role="menuitem"
            >
              <span className={`menu__item-link-icon icon-${item.icon}`} />
              {item.badge ? (
                <span className="indicator indicator--main-function">
                  {item.badge >= 100 ? "99+" : item.badge}
                </span>
              ) : null}
              <span className="menu__item-link-text">{item.text}</span>
            </Link>
          );
        })}
      />
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    messageCount: state.messages.unreadThreadCount,
    dependants: (state.dependants && state.dependants.list) || [],
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
const mapDispatchToProps = (dispatch: Dispatch<Action<AnyActionType>>) => ({});

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(MainFunctionNavbar)
);
