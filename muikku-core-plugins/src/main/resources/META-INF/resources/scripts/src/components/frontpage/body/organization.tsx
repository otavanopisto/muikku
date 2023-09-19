import * as React from "react";
import Button, { ButtonSocial } from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * FrontpageOrganization
 */
class FrontpageOrganization extends React.Component<WithTranslation> {
  /**
   * render
   */
  render() {
    return (
      <section
        id="organization"
        className="screen-container__section"
        aria-label={this.props.t("wcag.organizationDescription", {
          ns: "frontPage",
        })}
      >
        <div className="card card--frontpage-organization">
          <div className="ordered-container ordered-container--frontpage-organization-info">
            <div className="ordered-container__item ordered-container__item--organization-logo">
              <div className="ordered-container__item-subcontainer">
                <img
                  className="logo logo--organization"
                  src="/gfx/otavia-logo.jpg"
                  alt="Otavia logo"
                  title="Otavia logo"
                />
              </div>
            </div>

            <div className="ordered-container__item ordered-container__item--organization-social-media">
              <div className="ordered-container__item-subcontainer ordered-container__item-subcontainer--organization-social-media">
                <h2 className="ordered-container__subcontainer-header--social-media">
                  {this.props.t("labels.organization", {
                    ns: "frontPage",
                  })}
                </h2>
                <ButtonSocial
                  openInNewTab="_blank"
                  className="icon-twitter"
                  href="https://twitter.com/otaviafi"
                >
                  <span className="visually-hidden">Twitter Otavia</span>
                </ButtonSocial>
                <ButtonSocial
                  openInNewTab="_blank"
                  className="icon-linkedin"
                  href="https://www.linkedin.com/company/106028"
                >
                  <span className="visually-hidden">Linkedin Otavia</span>
                </ButtonSocial>
              </div>
            </div>

            <div className="ordered-container__item ordered-container__item--organization-description">
              <div className="ordered-container__item-subcontainer ordered-container__item-subcontainer--organization-description">
                <div
                  className="ordered-container__subcontainer-content ordered-container__subcontainer-content--organization-description"
                  dangerouslySetInnerHTML={{
                    __html: this.props.t("content.organization", {
                      ns: "frontPage",
                    }),
                  }}
                ></div>
                <Button
                  href="http://www.otavia.fi"
                  openInNewTab="_blank"
                  buttonModifiers={["branded", "frontpage-website"]}
                >
                  www.otavia.fi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation(["frontPage"])(FrontpageOrganization);
