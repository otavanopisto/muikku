import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers";

import { logout, LogoutTriggerType } from "~/actions/base/status";

import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import { getUserImageUrl } from "~/util/modifiers";

interface ProfileItemProps {
  modifier: string;
  i18n: i18nType;
  status: StatusType;
  logout: LogoutTriggerType;
  isProfileContainedInThisApp: boolean;
}

interface ProfileItemState {}

class ProfileItem extends React.Component<ProfileItemProps, ProfileItemState> {
  render() {
    if (!this.props.status.loggedIn) {
      return null;
    }
    const items: Array<any> = [
      {
        icon: "user",
        text: "plugin.profileBadge.links.personalInfo",
        href: "/profile",
        to: this.props.isProfileContainedInThisApp
      },
      {
        icon: "question",
        text: "plugin.profileBadge.links.userGuide",
        href: "https://otavanopisto.muikkuverkko.fi/workspace/ohjeet/materials",
        openInNewTab: "_blank"
      },
      {
        icon: "support",
        text: "plugin.profileBadge.links.helpdesk",
        href: "mailto:helpdesk@muikkuverkko.fi"
      },
      {
        icon: "sign-out",
        text: "plugin.profileBadge.links.logout",
        onClick: this.props.logout
      }
    ];
    return (
      <Dropdown
        modifier="profile"
        items={items.map((item) => {
          return (closeDropdown: () => any) => {
            return (
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
                <span>{this.props.i18n.text.get(item.text)}</span>
              </Link>
            );
          };
        })}
      >
        <Link
          className="button-pill button-pill--profile"
          role="menuitem"
          tabIndex={0}
          aria-haspopup="true"
          aria-label={this.props.i18n.text.get(
            "plugin.wcag.profileMenu.aria.label"
          )}
        >
          {this.props.status.hasImage ? (
            <img
              alt={this.props.i18n.text.get(
                "plugin.profileBadge.links.profileImageAtl"
              )}
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

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ logout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileItem);
