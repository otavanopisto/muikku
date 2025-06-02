/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import Link from "../link";
import { Link as RouterLink } from "react-router-dom";
import * as React from "react";
import { logout, LogoutTriggerType } from "~/actions/base/status";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import $ from "~/lib/jquery";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import "~/sass/elements/drawer.scss";
import "~/sass/elements/menu.scss";
import "~/sass/elements/link.scss";
import { getUserImageUrl } from "~/util/modifiers";
import { AnyActionType } from "~/actions";
import {
  OpenReadingRuler,
  openReadingRuler,
} from "~/actions/easy-to-use-functions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * checkLinkClicked
 * @param target target
 * @returns boolean
 */
function checkLinkClicked(target: HTMLElement): boolean {
  return (
    target.nodeName.toLowerCase() === "a" ||
    (target.parentElement ? checkLinkClicked(target.parentElement) : false)
  );
}

/**
 * DrawerProps
 */
interface DrawerProps extends WithTranslation {
  open: boolean;
  onClose: () => any;
  items: Array<React.ReactElement<any>>;
  modifier: string;
  navigation?: React.ReactElement<any> | Array<React.ReactElement<any>>;
  status: StatusType;
  logout: LogoutTriggerType;
  openReadingRuler: OpenReadingRuler;
}

/**
 * DrawerState
 */
interface DrawerState {
  displayed: boolean;
  visible: boolean;
  dragging: boolean;
  drag: number;
  open: boolean;
}

/**
 * Drawer
 */
class Drawer extends React.Component<DrawerProps, DrawerState> {
  private touchCordX: number;
  private touchCordY: number;
  private touchMovementX: number;
  private preventXMovement: boolean;

  /**
   * constructor
   * @param props props
   */
  constructor(props: DrawerProps) {
    super(props);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeByOverlay = this.closeByOverlay.bind(this);
    this.handleCloseLinkKeyDown = this.handleCloseLinkKeyDown.bind(this);

    this.state = {
      displayed: props.open,
      visible: props.open,
      dragging: false,
      drag: null,
      open: props.open,
    };
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: DrawerProps) {
    if (nextProps.open && !this.state.open) {
      this.open();
    } else if (!nextProps.open && this.state.open) {
      this.close();
    }
  }

  /**
   * onTouchStart
   * @param e e
   */
  onTouchStart(e: React.TouchEvent<any>) {
    this.setState({ dragging: true });
    this.touchCordX = e.changedTouches[0].pageX;
    this.touchCordY = e.changedTouches[0].pageY;
    this.touchMovementX = 0;
    this.preventXMovement = false;
    e.preventDefault();
  }

  /**
   * onTouchMove
   * @param e e
   */
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

  /**
   * onTouchEnd
   * @param e e
   */
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

  /**
   * open
   */
  open() {
    this.setState({ displayed: true, open: true });
    setTimeout(() => {
      this.setState({ visible: true });
    }, 10);
    $(document.body).css({ overflow: "hidden" });
  }

  /**
   * closeByOverlay
   * @param e e
   */
  closeByOverlay(e: React.MouseEvent<any>) {
    const isOverlay = e.target === e.currentTarget;
    const isLink = checkLinkClicked(e.target as HTMLElement);
    if (!this.state.dragging && (isOverlay || isLink)) {
      this.close();
    }
  }

  /**
   * close
   */
  close() {
    $(document.body).css({ overflow: "" });
    this.setState({ visible: false });
    setTimeout(() => {
      this.setState({ displayed: false, open: false });
      this.props.onClose();
    }, 300);
  }

  /**
   * Handles the keydown event for the close link
   * @param e e
   */
  handleCloseLinkKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      this.close();
    }
  }

  /**
   * render
   * @returns JSX.Element
   */
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
        aria-hidden={!this.state.open}
      >
        <div
          className="drawer__container"
          ref="menuContainer"
          style={{ left: this.state.drag }}
        >
          <div className="drawer__header">
            <div className="drawer__header-logo">
              <Link
                aria-label={this.props.i18n.t("wcag.goToMainPage")}
                href="/"
                className="drawer__header-link"
              >
                <img
                  src={`${
                    this.props.modifier == "frontpage"
                      ? "/gfx/oo-branded-site-logo-text.png"
                      : "/gfx/oo-branded-site-logo-text-white.png"
                  }`}
                  width="157"
                  height="56"
                  alt={this.props.t("content.home")}
                />
              </Link>
            </div>
            <Link
              aria-label={this.props.i18n.t("wcag.closeMainNavigation")}
              onKeyDown={this.handleCloseLinkKeyDown}
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
                    <RouterLink
                      className="menu__item-link menu__item-link--profile"
                      to="/profile"
                    >
                      {this.props.status.hasImage ? (
                        <img
                          src={getUserImageUrl(
                            this.props.status.userId,
                            null,
                            this.props.status.imgVersion
                          )}
                          className="button-image"
                        />
                      ) : (
                        <span className="menu__item-link-icon icon-user"></span>
                      )}
                      <span className="menu__item-link-text">
                        {this.props.t("labels.personalInfo")}
                      </span>
                    </RouterLink>
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
                        {this.props.t("labels.instructions")}
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
                        {this.props.t("labels.helpdesk")}
                      </span>
                    </Link>
                  </li>
                ) : null}
                <li className="menu__item menu__item--main">
                  <Link
                    className="menu__item-link menu__item-link--helpdesk"
                    onClick={this.props.openReadingRuler}
                  >
                    <span className="menu__item-link-icon icon-cogs"></span>
                    <span className="menu__item-link-text">
                      {this.props.t("labels.readingRuler")}
                    </span>
                  </Link>
                </li>
                {this.props.status.loggedIn ? (
                  <li className="menu__item menu__item--main">
                    <Link
                      className="menu__item-link menu__item-link--logout"
                      onClick={this.props.logout}
                    >
                      <span className="menu__item-link-icon icon-sign-out"></span>
                      <span className="menu__item-link-text">
                        {this.props.t("actions.signOut")}
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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ logout, openReadingRuler }, dispatch);
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Drawer)
);
