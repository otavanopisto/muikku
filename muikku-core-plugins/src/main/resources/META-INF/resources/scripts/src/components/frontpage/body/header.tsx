import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/hero.scss";
import "~/sass/elements/bubble.scss";
import "~/sass/elements/logo.scss";

import Button from "~/components/general/button";
import Bubble from "~/components/general/bubble";

interface FrontpageHeroProps {
  i18n: i18nType;
}

interface FrontpageHeroState {}

export default class FrontpageHero extends React.Component<
  FrontpageHeroProps,
  FrontpageHeroState
> {
  render() {
    return (
      <header className="hero hero--frontpage">
        <div className="hero__wrapper">
          <div className="hero__item hero__item--frontpage">
            <Bubble
              modifier="application"
              title={this.props.i18n.text.get(
                "plugin.header.studentApplicationBubble.title",
              )}
              content={this.props.i18n.text.get(
                "plugin.header.studentApplicationBubble.description",
              )}
            >
              <Button
                buttonModifiers={["branded", "frontpage-bubble", "warn"]}
                href="https://pyramus.otavanopisto.fi/applications/index.page"
                openInNewTab="_blank"
              >
                {this.props.i18n.text.get(
                  "plugin.header.studentApplicationBubble.link",
                )}
              </Button>
            </Bubble>
          </div>
          <div className="hero__item hero__item--frontpage">
            <div className="hero__item-logo-container">
              <img
                className="logo logo--muikku"
                src="/gfx/oo-branded-site-logo.png"
                alt="Muikku logo"
              ></img>
              <div className="hero__header-container">
                <h1 className="hero__header hero__header--frontpage-muikku">
                  {this.props.i18n.text.get("plugin.site.title")}
                </h1>
              </div>
            </div>
            <div className="hero__description">
              {this.props.i18n.text.get("plugin.header.site.description")}
            </div>
          </div>
          <div className="hero__item hero__item--frontpage">
            <Bubble
              modifier="goto-materials"
              title={this.props.i18n.text.get(
                "plugin.header.openMaterialsBubble.title",
              )}
              content={this.props.i18n.text.get(
                "plugin.header.openMaterialsBubble.description",
              )}
            >
              <Button
                buttonModifiers={["branded", "frontpage-bubble", "warn"]}
                href="/coursepicker"
              >
                {this.props.i18n.text.get(
                  "plugin.header.openMaterialsBubble.link",
                )}
              </Button>
            </Bubble>
          </div>
        </div>
      </header>
    );
  }
}
