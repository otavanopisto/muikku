import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { StatusType } from "~/reducers/base/status";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";
import { logout, LogoutTriggerType } from "~/actions/base/status";
import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import { getUserImageUrl } from "~/util/modifiers";
import {
  OpenReadingRuler,
  openReadingRuler,
} from "../../../actions/easy-to-use-functions/index";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ProfileItemProps
 */
interface ProfileItemProps extends WithTranslation {
  modifier: string;
  status: StatusType;
  logout: LogoutTriggerType;
  openReadingRuler: OpenReadingRuler;
  isProfileContainedInThisApp: boolean;
}

/**
 * ProfileItemState
 */
interface ProfileItemState {}

/**
 * ProfileItem
 */
class ProfileItem extends React.Component<ProfileItemProps, ProfileItemState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (!this.props.status.loggedIn) {
      return null;
    }
    const items: Array<any> = [
      {
        icon: "user",
        text: this.props.t("labels.personalInfo"),
        href: "/profile",
        to: this.props.isProfileContainedInThisApp,
      },
      {
        icon: "question",
        text: this.props.t("labels.instructions"),
        href: "https://otavanopisto.muikkuverkko.fi/workspace/ohjeet/materials",
        openInNewTab: "_blank",
      },
      {
        icon: "support",
        text: this.props.t("labels.helpdesk"),
        href: "mailto:helpdesk@muikkuverkko.fi",
      },
      {
        icon: "support",
        text: this.props.t("labels.opinvoimala"),
        href: "https://www.opinvoimala.fi",
        openInNewTab: "_blank",
      },
      {
        icon: "ruler",
        text: this.props.t("labels.readingRuler"),
        onClick: this.props.openReadingRuler,
      },
      {
        icon: "sign-out",
        text: this.props.t("actions.signOut"),
        onClick: this.props.logout,
      },
    ];
    return (
      <Dropdown
        modifier="profile"
        items={items.map((item) => (closeDropdown: () => any) => (
          <Link
            href={item.href}
            to={item.to ? item.href : null}
            className={`link link--full link--profile-dropdown`}
            onClick={(...args: any[]) => {
              closeDropdown();
              item.onClick && item.onClick(...args);
            }}
            openInNewTab={item.openInNewTab}
          >
            <span className={`link__icon icon-${item.icon}`}></span>
            <span>{item.text}</span>
          </Link>
        ))}
      >
        <Link
          className="button-pill button-pill--profile"
          role="menuitem"
          tabIndex={0}
          aria-haspopup="true"
          aria-label={this.props.t("wcag.profileMenu")}
        >
          {this.props.status.hasImage ? (
            <img
              alt={this.props.t("labels.profileImage", {ns: "profile"})}
              src={getUserImageUrl(
                this.props.status.userId,
                null,
                this.props.status.imgVersion
              )}
              className="button-image"
            />
          ) : (
            <span className="button-image">
              <span className="button-pill__icon icon-user" />
            </span>
          )}
        </Link>
      </Dropdown>
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ logout, openReadingRuler }, dispatch);
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(ProfileItem)
);
