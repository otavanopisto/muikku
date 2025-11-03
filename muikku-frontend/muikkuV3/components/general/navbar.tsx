import LanguagePicker from "./navbar/language-picker";
import ProfileItem from "./navbar/profile-item";
import Drawer from "./navbar/drawer";
import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import "~/sass/elements/navbar.scss";
import { WithTranslation, withTranslation } from "react-i18next";
import Link from "~/components/general/link";

/**
 * NavbarProps
 */
interface NavbarProps extends WithTranslation {
  modifier: string;
  navbarItems: {
    modifier?: string;
    item: React.ReactElement<any>;
  }[];
  menuItems: React.ReactElement<any>[];
  defaultOptions: React.ReactElement<any>[];
  navigation?: React.ReactElement<any> | Array<React.ReactElement<any>>;
  mobileTitle?: string;
  extraContent?: any;
  isProfileContainedInThisApp: boolean;
}

/**
 * NavbarState
 */
interface NavbarState {
  isMenuOpen: boolean;
}

/**
 * Navbar
 */
class Navbar extends React.Component<NavbarProps, NavbarState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: NavbarProps) {
    super(props);
    this.openMenu = this.openMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.handleOpenMenuKeyDown = this.handleOpenMenuKeyDown.bind(this);
    this.state = {
      isMenuOpen: false,
    };
  }

  /**
   * openMenu
   */
  openMenu() {
    this.setState({
      isMenuOpen: true,
    });
  }

  /**
   * closeMenu
   */
  closeMenu() {
    this.setState({
      isMenuOpen: false,
    });
  }

  /**
   * handleKeyDown
   * @param e e
   */
  handleOpenMenuKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this.openMenu();
    }
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="rs_skip_always">
        <nav
          className={`navbar ${
            this.props.modifier ? "navbar--" + this.props.modifier : ""
          }`}
          id="stick"
          aria-label={this.props.i18n.t("wcag.mainNavigation")}
        >
          <div className="navbar__wrapper">
            <div className="navbar__logo">
              <Dropdown
                openByHover
                key="frontpage"
                content={this.props.i18n.t("labels.home")}
              >
                <a href="/" className="navbar__logo-link">
                  <img
                    src={`${
                      this.props.modifier == "frontpage"
                        ? "/gfx/oo-branded-site-logo-text.png"
                        : "/gfx/oo-branded-site-logo-text-white.png"
                    }`}
                    width="175"
                    alt={this.props.i18n.t("content.home")}
                  />
                </a>
              </Dropdown>
            </div>
            <ul
              className="navbar__items"
              role="menubar"
              aria-label={this.props.i18n.t("wcag.mainNavigation")}
            >
              <li
                className={`navbar__item navbar__item--menu-button`}
                role="none"
              >
                <Link
                  tabIndex={0}
                  className={`link link--icon link--full ${
                    this.props.modifier ? "link--" + this.props.modifier : ""
                  }`}
                  onClick={this.openMenu}
                  onKeyDown={this.handleOpenMenuKeyDown}
                  role="menuitem"
                  aria-label={this.props.i18n.t("wcag.openMainNavigation")}
                  aria-haspopup="menu"
                  aria-expanded={this.state.isMenuOpen}
                >
                  <span className="link__icon icon-navicon"></span>
                </Link>
              </li>
              {this.props.navbarItems
                .map((item, index) => {
                  if (!item) {
                    return null;
                  }
                  return (
                    <li
                      key={index}
                      className={`navbar__item navbar__item--${item.modifier}`}
                      role="none"
                    >
                      {item.item}
                    </li>
                  );
                })
                .filter((item) => !!item)}
            </ul>
            {this.props.mobileTitle ? (
              <div className="navbar__mobile-title" aria-hidden="true">
                {this.props.mobileTitle}
              </div>
            ) : null}
            <ul
              className="navbar__default-options"
              role="menubar"
              aria-label={this.props.i18n.t("wcag.alternateNavigation")}
            >
              {this.props.defaultOptions}
              <li role="none" key="profile-item">
                <ProfileItem
                  modifier={this.props.modifier}
                  isProfileContainedInThisApp={
                    this.props.isProfileContainedInThisApp
                  }
                />
              </li>
              <li role="none" key="language-picker">
                <LanguagePicker />
              </li>
            </ul>
          </div>
        </nav>
        <Drawer
          open={this.state.isMenuOpen}
          onClose={this.closeMenu}
          items={this.props.menuItems}
          modifier={this.props.modifier}
          navigation={this.props.navigation}
        />
        {this.props.extraContent}
      </div>
    );
  }
}

export default withTranslation()(Navbar);
