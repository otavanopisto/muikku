import Link from "../link";
import * as React from "react";

import { logout, LogoutTriggerType } from "~/actions/base/status";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import $ from "~/lib/jquery";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";

function checkLinkClicked(target: HTMLElement): boolean {
  return (
    target.nodeName.toLowerCase() === "a" ||
    (target.parentElement ? checkLinkClicked(target.parentElement) : false)
  );
}

import "~/sass/elements/drawer.scss";
import "~/sass/elements/menu.scss";
import "~/sass/elements/link.scss";
import { getUserImageUrl } from "~/util/modifiers";

interface DrawerProps {
  open: boolean;
  onClose: () => any;
  items: Array<React.ReactElement<any>>;
  modifier: string;
  navigation?: React.ReactElement<any> | Array<React.ReactElement<any>>;
  status: StatusType;
  i18n: i18nType;
  logout: LogoutTriggerType;
}

interface DrawerState {
  displayed: boolean;
  visible: boolean;
  dragging: boolean;
  drag: number;
  open: boolean;
}

class Drawer extends React.Component<DrawerProps, DrawerState> {
  private touchCordX: number;
  private touchCordY: number;
  private touchMovementX: number;
  private preventXMovement: boolean;
  constructor(props: DrawerProps) {
    super(props);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeByOverlay = this.closeByOverlay.bind(this);

    this.state = {
      displayed: props.open,
      visible: props.open,
      dragging: false,
      drag: null,
      open: props.open,
    };
  }
  componentWillReceiveProps(nextProps: DrawerProps) {
    if (nextProps.open && !this.state.open) {
      this.open();
    } else if (!nextProps.open && this.state.open) {
      this.close();
    }
  }
  onTouchStart(e: React.TouchEvent<any>) {
    this.setState({ dragging: true });
    this.touchCordX = e.changedTouches[0].pageX;
    this.touchCordY = e.changedTouches[0].pageY;
    this.touchMovementX = 0;
    this.preventXMovement = false;
    e.preventDefault();
  }
  onTouchMove(e: React.TouchEvent<any>) {
    let diffX = e.changedTouches[0].pageX - this.touchCordX;
    const diffY = e.changedTouches[0].pageY - this.touchCordY;
    const absoluteDifferenceX = Math.abs(diffX - this.state.drag);
    this.touchMovementX += absoluteDifferenceX;

    if (diffX > 0) {
      diffX = 0;
    }

    if (diffX >= -3) {
      if (diffY >= 5 || diffY <= -5) {
        diffX = 0;
        this.preventXMovement = true;
      } else {
        this.preventXMovement = false;
      }
    }

    if (!this.preventXMovement) {
      this.setState({ drag: diffX });
    }
    e.preventDefault();
  }
  onTouchEnd(e: React.TouchEvent<any>) {
    const width = $(this.refs["menuContainer"]).width();
    const diff = this.state.drag;
    const movement = this.touchMovementX;

    const menuHasSlidedEnoughForClosing = Math.abs(diff) >= width * 0.33;
    const youJustClickedTheOverlay =
      e.target === this.refs["menu"] && movement <= 5;
    const youJustClickedALink =
      checkLinkClicked(e.target as HTMLElement) && movement <= 5;

    this.setState({ dragging: false });
    setTimeout(() => {
      this.setState({ drag: null });
      if (
        menuHasSlidedEnoughForClosing ||
        youJustClickedTheOverlay ||
        youJustClickedALink
      ) {
        this.close();
      }
    }, 10);
    e.preventDefault();
  }
  open() {
    this.setState({ displayed: true, open: true });
    setTimeout(() => {
      this.setState({ visible: true });
    }, 10);
    $(document.body).css({ overflow: "hidden" });
  }
  closeByOverlay(e: React.MouseEvent<any>) {
    const isOverlay = e.target === e.currentTarget;
    const isLink = checkLinkClicked(e.target as HTMLElement);
    if (!this.state.dragging && (isOverlay || isLink)) {
      this.close();
    }
  }
  close() {
    $(document.body).css({ overflow: "" });
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState({ displayed: false, open: false });
      this.props.onClose();
    }, 300);
  }
  render() {
    return (
      <div
        className={`drawer drawer--${this.props.modifier} ${
          this.state.displayed ? "state-DISPLAYED" : ""
        } ${this.state.visible ? "state-VISIBLE" : ""} ${
          this.state.dragging ? "state-DRAGGING" : ""
        }`}
        onClick={this.closeByOverlay}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
        ref="menu"
        aria-hidden="true"
      >
        <div
          className="drawer__container"
          ref="menuContainer"
          style={{ left: this.state.drag }}
        >
          <div className="drawer__header">
            <div className="drawer__header-logo">
              <Link href="/" className="drawer__header-link">
                <img
                  src={`${
                    this.props.modifier == "frontpage"
                      ? "/gfx/oo-branded-site-logo-text.png"
                      : "/gfx/oo-branded-site-logo-text-white.png"
                  }`}
                  width="157"
                  height="56"
                  alt={this.props.i18n.text.get(
                    "plugin.site.logo.linkBackToFrontPage",
                  )}
                />
              </Link>
            </div>
            <Link
              className={`drawer__button-close drawer__button-close--${this.props.modifier} icon-arrow-left`}
            ></Link>
          </div>
          <div className="drawer__body">
            {this.props.navigation && this.props.navigation}

            <nav className="menu-wrapper menu-wrapper--main">
              <ul className="menu">
                {this.props.items.map((item, index) => {
                  if (!item) {
                    return null;
                  }
                  return (
                    <li className="menu__item menu__item--main" key={index}>
                      {item}
                    </li>
                  );
                })}
                {this.props.status.loggedIn ? (
                  <li className="menu__spacer"></li>
                ) : null}
                {this.props.status.loggedIn ? (
                  <li className="menu__item menu__item--main">
                    <Link
                      className="menu__item-link menu__item-link--profile"
                      href="/profile"
                    >
                      {this.props.status.hasImage ? (
                        <img
                          src={getUserImageUrl(
                            this.props.status.userId,
                            null,
                            this.props.status.imgVersion,
                          )}
                          className="button-image"
                        />
                      ) : (
                        <span className="menu__item-link-icon icon-user"></span>
                      )}
                      <span className="menu__item-link-text">
                        {this.props.i18n.text.get(
                          "plugin.profileBadge.links.personalInfo",
                        )}
                      </span>
                    </Link>
                  </li>
                ) : null}
                {this.props.status.loggedIn ? (
                  <li className="menu__item menu__item--main">
                    <Link
                      className="menu__item-link menu__item-link--instructions"
                      href="https://otavanopisto.muikkuverkko.fi/workspace/ohjeet/materials"
                    >
                      <span className="menu__item-link-icon icon-question" />
                      <span className="menu__item-link-text">
                        {this.props.i18n.text.get(
                          "plugin.profileBadge.links.userGuide",
                        )}
                      </span>
                    </Link>
                  </li>
                ) : null}
                {this.props.status.loggedIn ? (
                  <li className="menu__item menu__item--main">
                    <Link
                      className="menu__item-link menu__item-link--helpdesk"
                      href="mailto:helpdesk@muikkuverkko.fi"
                    >
                      <span className="menu__item-link-icon icon-support"></span>
                      <span className="menu__item-link-text">
                        {this.props.i18n.text.get(
                          "plugin.profileBadge.links.helpdesk",
                        )}
                      </span>
                    </Link>
                  </li>
                ) : null}
                {this.props.status.loggedIn ? (
                  <li className="menu__item menu__item--main">
                    <Link
                      className="menu__item-link menu__item-link--logout"
                      onClick={this.props.logout}
                    >
                      <span className="menu__item-link-icon icon-sign-out"></span>
                      <span className="menu__item-link-text">
                        {this.props.i18n.text.get(
                          "plugin.profileBadge.links.logout",
                        )}
                      </span>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ logout }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Drawer);
