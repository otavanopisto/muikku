import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Button from "~/components/general/button";

import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/card.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/screen-container.scss';

interface FrontpageStudyingProps {
  i18n: i18nType
}

interface FrontpageStudyingState {
}

export default class FrontpageStudying extends React.Component<FrontpageStudyingProps, FrontpageStudyingState> {
  render() {
    return <section id="studying" className="screen-container__section">    
      <h2 className="screen-container__header">{this.props.i18n.text.get( 'plugin.sectionTitle.studying' )}</h2>
      <div className="ordered-container ordered-container--frontpage-studying">
        <div className="ordered-container__item ordered-container__item--upper-secondary-school">
          <div className="card">
            <img className="card__image" src="/gfx/kuva_nettilukio.png" alt="" title="" />
            <div className="card__content">
              <div className="card__title card__title--frontpage-upper-secondary-school">{this.props.i18n.text.get( 'plugin.studying.nettilukio.title' )}</div>
              <div className="card__text">{this.props.i18n.text.get( 'plugin.studying.nettilukio.description' )}</div>
            </div>
            <div className="card__footer">
              <Button href="http://www.nettilukio.fi/nettilukio_esittely"
                buttonModifiers={["branded", "frontpage-upper-secondary-school-readmore"]}>
                {this.props.i18n.text.get( 'plugin.studying.readMore.link' )} </Button>
            </div>
          </div>
        </div>
        <div className="ordered-container__item ordered-container__item--secondary-school">
          <div className="card">
            <img className="card__image" src="/gfx/kuva_nettiperuskoulu.png" alt="" title="" />
            <div className="card__content">
              <div className="card__title card__title--frontpage-secondary-school">{this.props.i18n.text.get( 'plugin.studying.nettiperuskoulu.title' )}</div>
              <div className="card__text">{this.props.i18n.text.get( 'plugin.studying.nettiperuskoulu.description' )}</div>
            </div>
            <div className="card__footer">
              <Button href="http://www.nettiperuskoulu.fi/esittely_nettipk"
                buttonModifiers={["branded", "frontpage-secondary-school-readmore"]}>
                {this.props.i18n.text.get( 'plugin.studying.readMore.link' )}</Button>
            </div>
          </div>
        </div>
        <div className="ordered-container__item ordered-container__item--open-materials">
          <div className="card">
            <img className="card__image" src="/gfx/kuva_aineopiskelu.png" alt="" title="" />
            <div className="card__content">
              <div className="card__title card__title--frontpage-open-materials">{this.props.i18n.text.get( 'plugin.studying.aineopiskelu.title' )}</div>
              <div className="card__text">{this.props.i18n.text.get( 'plugin.studying.aineopiskelu.description' )}</div>
            </div>
            <div className="card__footer">
              <Button href="http://aineopiskelu.otavanopisto.fi/esittely_aineopiskelu "
                buttonModifiers={["branded", "frontpage-open-materials-readmore"]}>
                {this.props.i18n.text.get( 'plugin.studying.readMore.link' )}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  }
}