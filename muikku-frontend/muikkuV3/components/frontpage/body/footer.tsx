import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * FrontpageFooter
 */
class FrontpageFooter extends React.Component<WithTranslation> {
  /**
   * render
   */
  render() {
    return (
      <footer className="footer" id="contact">
        <div className="footer__container">
          <div className="footer__item footer__item--contact">
            <h2 className="footer__header">
              {this.props.t("labels.contactInfo")}
            </h2>
            <p className="footer__subitem">
              <span className="glyph icon-location"></span>
              <b>{this.props.t("labels.address")}</b>
              <span>Otavantie 2 B, 50670 Otava</span>
            </p>
            <p className="footer__subitem">
              <span className="glyph icon-phone"></span>
              <b>{this.props.t("labels.phone")}</b>
              <span>044 794 3552</span>
            </p>
            <p className="footer__subitem">
              <span className="glyph icon-envelope-alt"></span>
              <b>{this.props.t("labels.email")}</b>
              <span>info@otavia.fi</span>
            </p>
            <p className="footer__subitem footer__subitem--privacy-policy">
              <a
                href="https://drive.google.com/file/d/1rcKBLel8fXZdwiqgBcZdu4MKTRHeyEHy/view?usp=sharing"
                target="_blank"
                className="link link--privacy-policy"
                rel="noreferrer"
              >
                {this.props.t("labels.privacyPolicy", {
                  ns: "frontPage",
                  context: "studentRegistry",
                })}
                <span className="visually-hidden">
                  {this.props.t("wcag.externalLink")}
                </span>
                <span
                  role="presentation"
                  className="external-link-indicator icon-external-link"
                />
              </a>
            </p>
            <p className="footer__subitem footer__subitem--accessibility-statement">
              <a
                href="https://drive.google.com/file/d/1oInmHuCFM33niWgaLMVBBkJIGIlNt8eF/view?usp=drive_link"
                target="_blank"
                className="link link--accessibility-statement"
                rel="noreferrer"
              >
                {this.props.t("labels.accessibilityStatement", {
                  ns: "frontPage",
                })}
                <span className="visually-hidden">
                  {this.props.t("wcag.externalLink")}
                </span>
                <span
                  role="presentation"
                  className="external-link-indicator icon-external-link"
                />
              </a>
            </p>
          </div>
          <div className="footer__item footer__item--logos">
            <img
              src="/gfx/otavia-logo-white.png"
              alt="Otavia logo"
              title="Otavia logo"
              className="logo--organization-footer"
            />
            <img
              src="/gfx/footer_logo.png"
              alt="Muikkuverkko logo"
              title="Muikkuverkko logo"
              className="logo logo--muikku-footer"
            />
          </div>
        </div>
      </footer>
    );
  }
}

export default withTranslation(["frontPage"])(FrontpageFooter);
