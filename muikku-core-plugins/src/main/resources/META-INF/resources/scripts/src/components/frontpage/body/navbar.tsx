import Navbar from "../../general/navbar";
import Link from "../../general/link";
import LoginButton from "../../base/login-button";
import ForgotPasswordDialog from "../../base/forgot-password-dialog";
import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * FrontpageNavbarProps
 */
interface FrontpageNavbarProps extends WithTranslation {}

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
                  {this.props.t("labels.studying", { ns: "frontPage" })}
                </span>
              </Link>
            ),
          },
          {
            modifier: "news",
            item: (
              <Link href="#news" className="link link--frontpage link--full">
                <span>{this.props.t("labels.news", { ns: "frontPage" })}</span>
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
                  {this.props.t("labels.organization", { ns: "frontPage" })}
                </span>
              </Link>
            ),
          },
          {
            modifier: "contact",
            item: (
              <Link href="#contact" className="link link--frontpage link--full">
                <span>
                  {this.props.t("labels.contact", { ns: "frontPage" })}
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
                  {this.props.t("labels.courses", { ns: "frontPage" })}
                </span>
              </Link>
            ),
          },
        ]}
        defaultOptions={[
          <LoginButton key="0" />,
          <ForgotPasswordDialog key="1">
            <Link tabIndex={0} className="link link--forgot-password">
              <span>{this.props.t("labels.forgotPasswordLink")}</span>
            </Link>
          </ForgotPasswordDialog>,
        ]}
        menuItems={[
          <Link key="studying" href="#studying" className="link link--full">
            <span>
              {this.props.t("labels.becomeStudent", { ns: "frontPage" })}
            </span>
          </Link>,
          <Link key="news" href="#news" className="link link--full">
            <span>{this.props.t("labels.news", { ns: "frontPage" })}</span>
          </Link>,
          <Link
            key="organization"
            href="#organization"
            className="link link--full"
          >
            <span>
              {this.props.t("labels.organization", { ns: "frontPage" })}
            </span>
          </Link>,
          <Link key="contact" href="#contact" className="link link--full">
            <span>{this.props.t("labels.contact", { ns: "frontPage" })}</span>
          </Link>,
          <Link
            key="coursepicker"
            href="/coursepicker"
            className="link link--highlight link--full"
          >
            <span>
              {this.props.t("labels.courses", { ns: "frontPage" })}
            </span>
          </Link>,
        ]}
      />
    );
  }
}

export default withTranslation(["frontPage"])(FrontpageNavbar);
