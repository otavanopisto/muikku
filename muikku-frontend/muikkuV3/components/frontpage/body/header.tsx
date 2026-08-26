import * as React from "react";
import Button from "~/components/general/button";
import Bubble from "~/components/general/bubble";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * FrontpageHeroProps
 */
interface FrontpageHeroProps extends WithTranslation<["frontPage"]> {}

/**
 * FrontpageHeroState
 */
interface FrontpageHeroState {}

/**
 * FrontpageHero
 */
class FrontpageHero extends React.Component<
  FrontpageHeroProps,
  FrontpageHeroState
> {
  /**
   * render
   */
  render() {
    return (
      <header className="hero hero--frontpage">
        <div className="hero__wrapper">
          <div className="hero__item hero__item--frontpage">
            <Bubble
              modifier="application"
              title={this.props.t("labels.studentApplication", {
                ns: "frontPage",
              })}
              content={this.props.t("content.studentApplication", {
                ns: "frontPage",
              })}
            >
              <Button
                buttonModifiers={["branded", "frontpage-bubble", "warn"]}
                href="/application"
                openInNewTab="_blank"
                data-de-aria-key="s"
                data-de-aria-horizontal-alignment="end-outside"
                data-de-aria-vertical-alignment="middle"
              >
                {this.props.t("actions.apply", {
                  ns: "frontPage",
                })}
              </Button>
            </Bubble>
          </div>
          <div className="hero__item hero__item--frontpage" tabIndex={0} data-de-aria-text="true" role="text">
            <div className="hero__item-logo-container">
              <img
                className="logo logo--muikku"
                src="/gfx/oo-branded-site-logo.png"
                alt="Muikku logo"
              ></img>
              <div className="hero__header-container">
                <h1 className="hero__header hero__header--frontpage-muikku">
                  {this.props.t("labels.site")}
                </h1>
              </div>
            </div>
            <div className="hero__description">
              {this.props.t("content.site", {
                ns: "frontPage",
              })}
            </div>
          </div>
          <div className="hero__item hero__item--frontpage">
            <Bubble
              modifier="goto-materials"
              title={this.props.t("labels.coursesAvailable", {
                ns: "frontPage",
              })}
              content={this.props.t("content.coursesAvailable", {
                ns: "frontPage",
              })}
            >
              <Button
                buttonModifiers={["branded", "frontpage-bubble", "warn"]}
                href="/coursepicker"
                data-de-aria-key="c"
                data-de-aria-horizontal-alignment="end-outside"
                data-de-aria-vertical-alignment="middle"
              >
                {this.props.t("actions.exploreCourses", {
                  ns: "frontPage",
                })}
              </Button>
            </Bubble>
          </div>
        </div>
      </header>
    );
  }
}

export default withTranslation(["frontPage"])(FrontpageHero);
