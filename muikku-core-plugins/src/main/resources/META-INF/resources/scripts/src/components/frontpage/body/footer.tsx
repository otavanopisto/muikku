import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";

import '~/sass/elements/footer.scss';
import '~/sass/elements/text.scss';

interface FrontpageFooterProps {
  i18n: i18nType
}

interface FrontpageFooterState {

}

export default class FrontpageFooter extends React.Component<FrontpageFooterProps, FrontpageFooterState> {
  render() {
    return <footer className="footer" id="contact">
      <div className="footer__container">
        <div className="footer__item footer__item--contact">
          <h2 className="text text--branded text--contact-us">{this.props.i18n.text.get( 'plugin.footer.contact.title' )}</h2>
          <p className="text text--branded text--contact-us-information">
            <span className="text-icon icon-location"></span>
            <b>{this.props.i18n.text.get( 'plugin.footer.streetAddress.label' )}</b>
            <span>Otavantie 2 B, 50670 Otava</span>
          </p>
          <p className="text text--branded text--contact-us-information">
            <span className="text-icon icon-phone"></span>
            <b>{this.props.i18n.text.get( 'plugin.footer.phoneNumber.label' )}</b>
            <span>015 194 3552</span>
          </p>
          <p className="text text--branded text--contact-us-information">
            <span className="text-icon icon-envelope"></span>
            <b>{this.props.i18n.text.get( 'plugin.footer.emailAddress.label' )}</b>
            <span>info@otavanopisto.fi</span>
          </p>
        </div>
        <div className="footer__item footer__item--logos">
          <img src="/gfx/alku_uudelle.jpg" alt="" title="" className="logo" />
          <img src="/gfx/footer_logo.jpg" alt="" title="" className="logo" />
        </div>
      </div>
    </footer>
  }
}