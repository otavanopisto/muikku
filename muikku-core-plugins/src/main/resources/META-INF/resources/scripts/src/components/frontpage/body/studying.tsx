import * as React from "react";
import { i18nType } from "~/reducers/base/i18nOLD";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
interface FrontpageStudyingProps {
 *
 */
interface FrontpageStudyingProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
}

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
        aria-label={this.props.i18nOLD.text.get(
          "plugin.wcag.frontPageSectionStudyingLabel"
        )}
      >
        <h2 className="screen-container__header">
          {this.props.i18nOLD.text.get("plugin.sectionTitle.studying")}
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
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.nettilukio.title"
                  )}
                </div>
                <div className="card__text">
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.nettilukio.description"
                  )}
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
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.nettilukio.link"
                  )}{" "}
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
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.nettiperuskoulu.title"
                  )}
                </div>
                <div className="card__text">
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.nettiperuskoulu.description"
                  )}
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
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.nettiperuskoulu.link"
                  )}
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
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.aineopiskelu.title"
                  )}
                </div>
                <div className="card__text">
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.aineopiskelu.description"
                  )}
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
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.nettilukio.aineopiskelu.link"
                  )}
                </Button>
                <Button
                  openInNewTab="_blank"
                  href="https://nettiperuskoulu.fi/aineopiskelu"
                  buttonModifiers={[
                    "branded",
                    "frontpage-open-materials-readmore",
                  ]}
                >
                  {this.props.i18nOLD.text.get(
                    "plugin.studying.nettiperuskoulu.aineopiskelu.link"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation(["common"])(FrontpageStudying);
