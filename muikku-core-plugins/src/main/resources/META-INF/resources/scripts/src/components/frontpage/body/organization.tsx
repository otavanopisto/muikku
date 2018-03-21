import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Button, { ButtonSocial } from "~/components/general/button";

import '~/sass/elements/container.scss';
import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/logo.scss';
import '~/sass/elements/buttons.scss';

interface FrontpageOrganizationProps {
  i18n: i18nType
}

interface FrontpageOrganizationState {

}

export default class FrontpageOrganization extends React.Component<FrontpageOrganizationProps, FrontpageOrganizationState> {
  render() {
    return <section id="organization" className="container container--frontpage-section">

      <div className="card card--frontpage-otavan-opisto">
        <div className="ordered-container ordered-container--frontpage-otavan-opisto-info">
          <div className="ordered-container__item ordered-container__item--otavan-opisto-logo">
            <div className="container container--otavan-opisto-logo">
              <img className="logo logo--otavan-opisto" src="/gfx/oo-branded-organization-logo.jpg" alt="logo" title="logo" />
            </div>
          </div>

          <div className="ordered-container__item ordered-container__item--otavan-opisto-social-media">
            <div className="container container--otavan-opisto-social-media">
              <h2 className="text text--branded text--otavan-opisto-info-title">
                {this.props.i18n.text.get( 'plugin.organization.some.title' )}
              </h2>
              <ButtonSocial className="icon-some-facebook" href="https://www.facebook.com/otavanopisto" target="top"/>
              <ButtonSocial className="icon-some-twitter" href="https://twitter.com/OtavanOpisto" target="top"/>
              <ButtonSocial className="icon-some-instagram" href="https://www.instagram.com/otavanopisto/" target="top"/>
              <ButtonSocial className="icon-some-pinterest" href="https://fi.pinterest.com/otavanopisto/" target="top"/>
              <ButtonSocial className="icon-some-linkedin" href="https://www.linkedin.com/company/106028" target="top"/>
            </div>
          </div>

          <div className="ordered-container__item ordered-container__item--otavan-opisto-description">
            <div className="container container--otavan-opisto-description">
              <div className="text text--branded text--otavan-opisto-info-description"
                dangerouslySetInnerHTML={{ __html: this.props.i18n.text.get( 'plugin.organization.description')}}>
              </div>
              <Button href="http://www.otavanopisto.fi" target="top" buttonModifiers={["branded", "frontpage-website"]}>
                www.otavanopisto.fi
              </Button>
              <Button href="http://www.otavanopisto.fi/uutiskirje" target="top" buttonModifiers={["branded", "frontpage-newsletter"]}>
                {this.props.i18n.text.get( 'plugin.organization.newsletter.link' )}
              </Button>
            </div>

          </div>

        </div>

      </div>
    </section>
  }
}