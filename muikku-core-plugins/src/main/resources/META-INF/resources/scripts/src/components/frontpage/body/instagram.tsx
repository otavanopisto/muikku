import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * FrontpageInstagramProps
 */
interface FrontpageInstagramProps extends WithTranslation {}

/**
 * FrontpageInstagramState
 */
interface FrontpageInstagramState {}

/**
 * FrontpageInstagram
 */
class FrontpageInstagram extends React.Component<
  FrontpageInstagramProps,
  FrontpageInstagramState
> {
  /**
   * render
   */
  render() {
    return (
      <section
        id="instagram"
        className="screen-container__section"
        aria-label={this.props.t("wcag.instagram", { ns: "frontPage" })}
      >
        <h2 className="screen-container__header">
          {this.props.t("labels.instagram", { ns: "frontPage" })}
        </h2>
        <div className="ordered-container ordered-container--frontpage-instagram">
          <div className="ordered-container__item ordered-container__item--frontpage-instagram">
            <div className="card">
              <div className="card__content">
                <div className="card__meta">
                  <div className="card__meta-aside">
                    <span className="card__meta-aside-logo icon-instagram">
                      <span className="visually-hidden">
                        {this.props.t("wcag.externalLink")}
                      </span>
                    </span>
                  </div>
                  <div className="card__meta-body">
                    <div className="card__meta-body-title">
                      <a
                        className="card__meta-body-link card__meta-body-link--instagram"
                        href="https://www.instagram.com/nettilukio.fi/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="visually-hidden">Instagram </span>
                        {this.props.t("labels.nettilukio", {
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
                    </div>
                    <div className="card__meta-body-title">
                      <a
                        className="card__meta-body-link card__meta-body-link--instagram"
                        href="https://www.instagram.com/nettiperuskoulu/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span className="visually-hidden">Instagram </span>
                        {this.props.t("labels.nettiperuskoulu", {
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation(["frontPage"])(FrontpageInstagram);
