import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";

import '~/sass/elements/hero.scss';
import '~/sass/elements/bubble.scss';
import '~/sass/elements/logo.scss';
import '~/sass/elements/text.scss';
import Button from "~/components/general/button";
import Bubble from "~/components/general/bubble";

interface FrontpageHeroProps {
  i18n: i18nType
}

interface FrontpageHeroState {
  
}

export default class FrontpageHero extends React.Component<FrontpageHeroProps, FrontpageHeroState> {
  render() {
    return <header className="hero hero--frontpage">
      <div className="hero__wrapper">
        <div className="hero__wrapper__item">
          <Bubble modifier="application" title={this.props.i18n.text.get( 'plugin.header.studentApplicationBubble.title')}
            content={this.props.i18n.text.get( 'plugin.header.studentApplicationBubble.description')}>
            <Button buttonModifiers={["branded", "frontpage-bubble", "warn"]}>
              {this.props.i18n.text.get( 'plugin.header.studentApplicationBubble.link' )}
            </Button>
          </Bubble>
        </div>
        <div className="hero__wrapper__item">
          <div className="container container--muikku-logo">
            <img className="logo logo--muikku-verkko" src="/gfx/oo-branded-site-logo.png"></img>
            <div className="text">
              <div className="text text--branded text--frontpage-muikku-author">{this.props.i18n.text.get( 'plugin.header.site.author' )}</div>
              <div className="text text--branded text--frontpage-muikku">MUIKKU</div>
              <div className="text text--branded text--frontpage-verkko">VERKKO</div>
            </div>
          </div>
          <div className="text text--branded text--frontpage-muikku-description">{this.props.i18n.text.get( 'plugin.header.site.description' )}</div>
        </div>
        <div className="hero__wrapper__item">
          <Bubble modifier="goto-materials" title={this.props.i18n.text.get( 'plugin.header.openMaterialsBubble.title' )}
            content={this.props.i18n.text.get( 'plugin.header.openMaterialsBubble.description')}>
            <Button buttonModifiers={["branded", "frontpage-bubble", "warn"]}>
              {this.props.i18n.text.get( 'plugin.header.openMaterialsBubble.link' )}
            </Button>
          </Bubble>
        </div>
      </div>
    </header>
  }
}