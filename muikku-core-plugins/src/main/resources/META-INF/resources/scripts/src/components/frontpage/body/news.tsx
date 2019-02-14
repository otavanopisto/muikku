import * as React from "react";
import FrontpageFeed from './feed';
import { i18nType } from "~/reducers/base/i18n";
import Carousel, { CarouselItem } from "~/components/general/carousel";


import '~/sass/elements/ordered-container.scss';

import '~/sass/elements/card.scss';

interface FrontpageNewsProps {
  i18n: i18nType
}

interface FrontpageNewsState {

}

export default class FrontpageNews extends React.Component<FrontpageNewsProps, FrontpageNewsState> {
  render() {
    return <section id="news" className="screen-container__section">
      <h2 className="screen-container__header">{this.props.i18n.text.get( 'plugin.sectionTitle.news' )}</h2>
      <div className="ordered-container ordered-container--frontpage-news-and-events">
        <div className="ordered-container__item ordered-container__item--frontpage-events">
          <div className="card">
            <div className="card__content">
              <h2 className="card__title">{this.props.i18n.text.get( 'plugin.frontpageBoxTitle.events' )}</h2>
              <div className="frontpage-events-container">
                <FrontpageFeed queryOptions={{ numItems: 4, order: "ASCENDING" }} feedReadTarget="ooevents"></FrontpageFeed>
              </div>
            </div>
          </div>
        </div>

        <div className="ordered-container__item ordered-container__item--frontpage-news">
          <div className="card">
            <div className="card__content">
              <h2 className="card__title">{this.props.i18n.text.get( 'plugin.frontpageBoxTitle.news' )}</h2>
              <div className="frontpage-news-container">
                <FrontpageFeed queryOptions={{ numItems: 5 }} feedReadTarget="oonews"></FrontpageFeed>
              </div>
            </div>
          </div>
        </div>

        <div className="ordered-container__item ordered-container__item--frontpage-images">
          <div className="card">
            <Carousel>
              <CarouselItem>
                <img className="card__image" src="/gfx/kuva2.jpg" alt=""
                  title="" />
                <div className="card__content">
                  <div className="card__text">{this.props.i18n.text.get( 'plugin.images.description.image2' )}</div>
                </div>
              </CarouselItem>

              <CarouselItem>
                <img className="card__image" src="/gfx/kuva1.jpg" alt="" title="" />
                <div className="card__content">
                  <div className="card__text">{this.props.i18n.text.get( 'plugin.images.description.image1' )}</div>
                </div>
              </CarouselItem>

              <CarouselItem>
                <img className="card__image" src="/gfx/kuva3.jpg" alt="" title="" />
                <div className="card__content">
                  <div className="card__text">{this.props.i18n.text.get( 'plugin.images.description.image3' )}</div>
                </div>
              </CarouselItem>

              <CarouselItem>
                <img className="card__image" src="/gfx/kuva5.jpg" alt=""
                  title="" />
                <div className="card__content">
                  <div className="card__text">
                    {this.props.i18n.text.get( 'plugin.images.description.image5' )}</div>
                </div>
              </CarouselItem>

            </Carousel>
          </div>
        </div>

        <div className="ordered-container__item ordered-container__item--frontpage-blogs">
          <div className="card">
            <div className="card__content">
              <h2 className="card__title">{this.props.i18n.text.get( 'plugin.frontpageBoxTitle.blogs' )}</h2>
              <div className="frontpage-blogs-container">
                <FrontpageFeed queryOptions={{ numItems: 6 }}
                  feedReadTarget="eoppimiskeskus,open,ebarometri,matskula,oppiminen,polkuja,reissuvihko,jalkia"></FrontpageFeed>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  }
}