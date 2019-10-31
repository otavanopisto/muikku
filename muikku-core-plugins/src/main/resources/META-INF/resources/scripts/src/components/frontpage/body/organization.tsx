import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Button, { ButtonSocial } from "~/components/general/button";

import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/logo.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/rich-text.scss';

interface FrontpageOrganizationProps {
  i18n: i18nType
}

interface FrontpageOrganizationState {

}

export default class FrontpageOrganization extends React.Component<FrontpageOrganizationProps, FrontpageOrganizationState> {
  render() {
    return <section id="organization" className="screen-container__section">

      <div className="card card--frontpage-organization">
        <div className="ordered-container ordered-container--frontpage-organization-info">
          <div className="ordered-container__item ordered-container__item--organization-logo">
            <div className="ordered-container__item-subcontainer">
              <img className="logo logo--organization" src="/gfx/otavia-logo.jpg" alt="Otavia logo" title="Otavia logo" />
            </div>
          </div>

          <div className="ordered-container__item ordered-container__item--organization-social-media">
            <div className="ordered-container__item-subcontainer ordered-container__item-subcontainer--organization-social-media">
              <h2 className="ordered-container__subcontainer-header--social-media">
                {this.props.i18n.text.get( 'plugin.organization.some.title' )}
              </h2>
              <ButtonSocial className="icon-facebook" href="https://www.facebook.com/otavanopisto" target="top"/>
              <ButtonSocial className="icon-twitter" href="https://twitter.com/OtavanOpisto" target="top"/>
              <ButtonSocial className="icon-instagram" href="https://www.instagram.com/otavanopisto/" target="top"/>
              <ButtonSocial className="icon-pinterest" href="https://fi.pinterest.com/otavanopisto/" target="top"/>
              <ButtonSocial className="icon-linkedin" href="https://www.linkedin.com/company/106028" target="top"/>
            </div>
          </div>

          <div className="ordered-container__item ordered-container__item--organization-description">
            <div className="ordered-container__item-subcontainer ordered-container__item-subcontainer--organization-description">
              <div className="ordered-container__subcontainer-content ordered-container__subcontainer-content--organization-description"
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