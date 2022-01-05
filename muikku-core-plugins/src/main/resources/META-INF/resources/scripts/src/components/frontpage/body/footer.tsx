import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/footer.scss";
import "~/sass/elements/wcag.scss";

interface FrontpageFooterProps {
  i18n: i18nType;
}

interface FrontpageFooterState {}

export default class FrontpageFooter extends React.Component<
  FrontpageFooterProps,
  FrontpageFooterState
> {
  render() {
    return (
      <footer className="footer" id="contact">
        <div className="footer__container">
          <div className="footer__item footer__item--contact">
            <h2 className="footer__header">
              {this.props.i18n.text.get("plugin.footer.contact.title")}
            </h2>
            <p className="footer__subitem">
              <span className="glyph icon-location"></span>
              <b>
                {this.props.i18n.text.get("plugin.footer.streetAddress.label")}
              </b>
              <span>Otavantie 2 B, 50670 Otava</span>
            </p>
            <p className="footer__subitem">
              <span className="glyph icon-phone"></span>
              <b>
                {this.props.i18n.text.get("plugin.footer.phoneNumber.label")}
              </b>
              <span>044 794 3552</span>
            </p>
            <p className="footer__subitem">
              <span className="glyph icon-envelope-alt"></span>
              <b>
                {this.props.i18n.text.get("plugin.footer.emailAddress.label")}
              </b>
              <span>info@otavia.fi</span>
            </p>
            <p className="footer__subitem footer__subitem--privacy-policy">
              <a
                href="https://drive.google.com/file/d/1rcKBLel8fXZdwiqgBcZdu4MKTRHeyEHy/view?usp=sharing"
                target="_blank"
                className="link link--privacy-policy"
                rel="noreferrer"
              >
                <span className="visually-hidden">Otavia </span>
                {this.props.i18n.text.get(
                  "plugin.footer.ooPrivacyPolicy.label",
                )}
              </a>
            </p>
            <p className="footer__subitem footer__subitem--accessibility-statement">
              <a
                href="https://docs.google.com/document/d/1EXS3TroGTNAq9N8bV1pK6W2byKntZpHudBHH3NBGgXY/edit?usp=sharing"
                target="_blank"
                className="link link--accessibility-statement"
                rel="noreferrer"
              >
                {this.props.i18n.text.get(
                  "plugin.footer.accesibilityStatement.text",
                )}
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
        <div className="footer__container--plagscan">
          <div className="footer__item footer__item--plagscan">
            <a
              href="https://www.plagscan.com"
              className="link link--plagscan-logo"
              target="_blank"
              rel="noreferrer"
            >
              <img src="/gfx/plagscan-logo-white.png" alt="Plagscan logo" />
            </a>
            <span className="footer__item--plagscan-text">
              {this.props.i18n.text.get("plugin.footer.plagscan.text")}
            </span>
            <a
              href="https://drive.google.com/file/d/1IDQWdh2N1EoaJe60uS1m9tyY5znaohzz/view?usp=sharing"
              target="_blank"
              className="link link--plagscan-privacy-policy"
              rel="noreferrer"
            >
              (<span className="visually-hidden">Plagscan </span>
              {this.props.i18n.text.get(
                "plugin.footer.plagScanPrivacyPolicy.label",
              )}
              ).
            </a>
          </div>
        </div>
      </footer>
    );
  }
}
