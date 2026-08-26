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
            <h2 className="footer__header" data-de-aria-text="true" role="section" tabIndex={0}>
              {this.props.t("labels.contactInfo")}
            </h2>
            <p className="footer__subitem" data-de-aria-text="true" role="text" tabIndex={0}>
              <span className="glyph icon-location"></span>
              <b>{this.props.t("labels.address")}</b>
              <span>Otavantie 2 B, 50670 Otava</span>
            </p>
            <p className="footer__subitem" data-de-aria-text="true" role="text" tabIndex={0}>
              <span className="glyph icon-phone"></span>
              <b>{this.props.t("labels.phone")}</b>
              <span>044 794 3552</span>
            </p>
            <p className="footer__subitem" data-de-aria-text="true" role="text" tabIndex={0}>
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
                data-de-aria-key="f"
                data-de-aria-horizontal-alignment="end-outside"
                data-de-aria-vertical-alignment="middle"
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
                data-de-aria-key="f"
                data-de-aria-horizontal-alignment="end-outside"
                data-de-aria-vertical-alignment="middle"
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
              data-de-aria-text="true"
              tabIndex={0}
            />
            <img
              src="/gfx/footer_logo.png"
              alt="Muikkuverkko logo"
              title="Muikkuverkko logo"
              className="logo logo--muikku-footer"
              data-de-aria-text="true"
              tabIndex={0}
            />
          </div>
        </div>
        <div className="footer__container--plagscan">
          <div className="footer__item footer__item--plagscan">
            <a
              href="https://www.plagscan.com"
              className="link link--plagscan-logo"
              target="_blank"
              rel="noreferrer"
              data-de-aria-key="f"
              data-de-aria-horizontal-alignment="end-outside"
              data-de-aria-vertical-alignment="top-outside"
            >
              <img src="/gfx/plagscan-logo-white.png" alt="Plagscan logo" />
              <span className="visually-hidden">
                {this.props.t("wcag.externalLink")}
              </span>
              <span
                role="presentation"
                className="external-link-indicator icon-external-link"
              />
            </a>
            <span className="footer__item--plagscan-text" data-de-aria-text="true" role="text" tabIndex={0}>
              {this.props.t("content.plagScan", { ns: "frontPage" })}
            </span>
            <a
              href="https://drive.google.com/file/d/1IDQWdh2N1EoaJe60uS1m9tyY5znaohzz/view?usp=sharing"
              target="_blank"
              className="link link--plagscan-privacy-policy"
              rel="noreferrer"
              data-de-aria-key="f"
              data-de-aria-horizontal-alignment="end-outside"
              data-de-aria-vertical-alignment="middle"
            >
              (
              {this.props.t("labels.privacyPolicy", {
                ns: "frontPage",
              })}
              <span className="visually-hidden">
                {this.props.t("wcag.externalLink")}
              </span>
              <span
                role="presentation"
                className="external-link-indicator icon-external-link"
              />
              ).
            </a>
          </div>
        </div>
      </footer>
    );
  }
}

export default withTranslation(["frontPage"])(FrontpageFooter);
