import Navbar from "../../general/navbar";
import Link from "../../general/link";
import LoginButton from "../../base/login-button";
import ForgotPasswordDialog from "../../base/forgot-password-dialog";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * FrontpageNavbarProps
 */
interface FrontpageNavbarProps extends WithTranslation<["frontPage", "common"]> {
  i18nOLD: i18nType;
}

/**
 * FrontpageNavbarState
 */
interface FrontpageNavbarState {}

/**
 * FrontpageNavbar
 */
class FrontpageNavbar extends React.Component<
  FrontpageNavbarProps,
  FrontpageNavbarState
> {
  /**
   * FrontpageNavbarProps
   * @param props props
   */
  constructor(props: FrontpageNavbarProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    return (
      <Navbar
        modifier="frontpage"
        isProfileContainedInThisApp={false}
        navbarItems={[
          {
            modifier: "studying",
            item: (
              <Link
                href="#studying"
                className="link link--frontpage link--full"
              >
                <span>
                {this.props.t(
                    "frontPage:labels.studying"
                  )}

                  {this.props.i18nOLD.text.get(
                    "plugin.navigation.link.studying"
                  )}
                </span>
              </Link>
            ),
          },
          {
            modifier: "news",
            item: (
              <Link href="#news" className="link link--frontpage link--full">
                <span>
                  {this.props.i18nOLD.text.get("plugin.navigation.link.news")}
                </span>
              </Link>
            ),
          },
          {
            modifier: "organization",
            item: (
              <Link
                href="#organization"
                className="link link--frontpage link--full"
              >
                <span>
                  {this.props.i18nOLD.text.get(
                    "plugin.navigation.link.organization"
                  )}
                </span>
              </Link>
            ),
          },
          {
            modifier: "contact",
            item: (
              <Link href="#contact" className="link link--frontpage link--full">
                <span>
                  {this.props.i18nOLD.text.get(
                    "plugin.navigation.link.contact"
                  )}
                </span>
              </Link>
            ),
          },
          {
            modifier: "open-materials",
            item: (
              <Link
                href="/coursepicker"
                className="link link--frontpage link--highlight link--full"
              >
                <span>
                  {this.props.i18nOLD.text.get(
                    "plugin.navigation.link.openMaterials"
                  )}
                </span>
              </Link>
            ),
          },
        ]}
        defaultOptions={[
          <LoginButton key="0" />,
          <ForgotPasswordDialog key="1">
            <Link tabIndex={0} className="link link--forgot-password">
              <span>
                {this.props.i18nOLD.text.get(
                  "plugin.forgotpassword.forgotLink"
                )}
              </span>
            </Link>
          </ForgotPasswordDialog>,
        ]}
        menuItems={[
          <Link key="studying" href="#studying" className="link link--full">
            <span>
              {this.props.i18nOLD.text.get("plugin.navigation.link.studying")}
            </span>
          </Link>,
          <Link key="news" href="#news" className="link link--full">
            <span>
              {this.props.i18nOLD.text.get("plugin.navigation.link.news")}
            </span>
          </Link>,
          <Link
            key="organization"
            href="#organization"
            className="link link--full"
          >
            <span>
              {this.props.i18nOLD.text.get(
                "plugin.navigation.link.organization"
              )}
            </span>
          </Link>,
          <Link key="contact" href="#contact" className="link link--full">
            <span>
              {this.props.i18nOLD.text.get("plugin.navigation.link.contact")}
            </span>
          </Link>,
          <Link
            key="coursepicker"
            href="/coursepicker"
            className="link link--highlight link--full"
          >
            <span>
              {this.props.i18nOLD.text.get(
                "plugin.navigation.link.openMaterials"
              )}
            </span>
          </Link>,
        ]}
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
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["frontPage", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(FrontpageNavbar)
);
