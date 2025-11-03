import * as React from "react";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
interface FrontpageStudyingProps {
 *
 */
interface FrontpageStudyingProps extends WithTranslation {}

/**
 * FrontpageStudyingState
 */
interface FrontpageStudyingState {}

/**
 * FrontpageStudying
 */
class FrontpageStudying extends React.Component<
  FrontpageStudyingProps,
  FrontpageStudyingState
> {
  /**
   * render
   */
  render() {
    return (
      <section
        id="studying"
        className="screen-container__section"
        aria-label={this.props.t("wcag.studying", { ns: "frontPage" })}
      >
        <h2 className="screen-container__header">
          {this.props.t("labels.becomeStudent", { ns: "frontPage" })}
        </h2>
        <div className="ordered-container ordered-container--frontpage-studying">
          <div className="ordered-container__item ordered-container__item--upper-secondary-school">
            <div className="card">
              <img
                className="card__image"
                src="/gfx/kuva_nettilukio.png"
                alt=""
                role="presentation"
              />
              <div className="card__content">
                <div className="card__title card__title--frontpage-upper-secondary-school">
                  {this.props.t("labels.nettilukio", { ns: "frontPage" })}
                </div>
                <div className="card__text">
                  {this.props.t("content.nettilukio", { ns: "frontPage" })}
                </div>
              </div>
              <div className="card__footer">
                <Button
                  openInNewTab="_blank"
                  href="https://nettilukio.fi"
                  buttonModifiers={[
                    "branded",
                    "frontpage-upper-secondary-school-readmore",
                  ]}
                >
                  {this.props.t("actions.tourNettilukio", { ns: "frontPage" })}
                </Button>
              </div>
            </div>
          </div>
          <div className="ordered-container__item ordered-container__item--secondary-school">
            <div className="card">
              <img
                className="card__image"
                src="/gfx/kuva_nettiperuskoulu.png"
                alt=""
                role="presentation"
              />
              <div className="card__content">
                <div className="card__title card__title--frontpage-secondary-school">
                  {this.props.t("labels.nettiperuskoulu", { ns: "frontPage" })}
                </div>
                <div className="card__text">
                  {this.props.t("content.nettiperuskoulu", { ns: "frontPage" })}{" "}
                </div>
              </div>
              <div className="card__footer">
                <Button
                  openInNewTab="_blank"
                  href="https://nettiperuskoulu.fi"
                  buttonModifiers={[
                    "branded",
                    "frontpage-secondary-school-readmore",
                  ]}
                >
                  {this.props.t("actions.tourNettiperuskoulu", {
                    ns: "frontPage",
                  })}
                </Button>
              </div>
            </div>
          </div>
          <div className="ordered-container__item ordered-container__item--open-materials">
            <div className="card">
              <img
                className="card__image"
                src="/gfx/kuva_aineopiskelu.png"
                alt=""
                role="presentation"
              />
              <div className="card__content">
                <div className="card__title card__title--frontpage-open-materials">
                  {this.props.t("labels.aineopiskelu", { ns: "frontPage" })}
                </div>
                <div className="card__text">
                  {this.props.t("content.aineopiskelu", { ns: "frontPage" })}{" "}
                </div>
              </div>
              <div className="card__footer">
                <Button
                  openInNewTab="_blank"
                  href="https://nettilukio.fi/aineopiskelu"
                  buttonModifiers={[
                    "branded",
                    "frontpage-open-materials-readmore",
                  ]}
                >
                  {this.props.t("actions.tourNettilukio", {
                    ns: "frontPage",
                    context: "aineopiskelu",
                  })}
                </Button>
                <Button
                  openInNewTab="_blank"
                  href="https://nettiperuskoulu.fi/aineopiskelu"
                  buttonModifiers={[
                    "branded",
                    "frontpage-open-materials-readmore",
                  ]}
                >
                  {this.props.t("actions.tourNettiperuskoulu", {
                    ns: "frontPage",
                    context: "aineopiskelu",
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation(["frontPage"])(FrontpageStudying);
