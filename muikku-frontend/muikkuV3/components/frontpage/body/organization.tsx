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
        <h2 className="screen-container__header" data-de-aria-text="true" tabIndex={0} role="section">
          {this.props.t("labels.organization", {
            ns: "frontPage",
          })}
        </h2>
        <div className="card card--frontpage-organization">
          <div className="ordered-container ordered-container--frontpage-organization-info" role="group" data-de-aria-text="true" tabIndex={0}>
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
                  data-de-aria-key="o"
                  data-de-aria-horizontal-alignment="center"
                  data-de-aria-vertical-alignment="bottom-outside"
                >
                  www.otavia.fi
                </Button>
                <ButtonSocial
                  openInNewTab="_blank"
                  className="icon-linkedin"
                  href="https://www.linkedin.com/company/106028"
                  data-de-aria-key="o"
                  data-de-aria-horizontal-alignment="center"
                  data-de-aria-vertical-alignment="bottom-outside"
                >
                  <span className="visually-hidden">Linkedin Otavia</span>
                </ButtonSocial>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation(["frontPage"])(FrontpageOrganization);
