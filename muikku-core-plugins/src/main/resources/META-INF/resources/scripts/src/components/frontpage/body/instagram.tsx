import * as React from "react";
import InstagramFeed from '../../general/instagram-feed';
import { i18nType } from "~/reducers/base/i18n";

import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/card.scss';

interface FrontpageInstagramProps {
  i18n: i18nType
}

interface FrontpageInstagramState {

}

export default class FrontpageInstagram extends React.Component<FrontpageInstagramProps, FrontpageInstagramState> {
  render() {
    const INSTAGRAM_ID = "11359596292";
    const THUMBNAIL_WIDTH = 640;
    const PHOTO_COUNT = 12;

    return <section id="news" className="screen-container__section">
      <h2 className="screen-container__header">{this.props.i18n.text.get( 'plugin.sectionTitle.instagram' )}</h2>
      <div className="ordered-container ordered-container--frontpage-instagram">

        <div className="ordered-container__item ordered-container__item--frontpage-instagram">
          <div className="card">
            <div className="card__content">
              <div className="card__meta">
                <div className="card__meta-aside">
                  <a href="https://www.instagram.com/muikkuofficial/" target="_blank"><span className="card__meta-aside-logo icon-instagram"></span></a>
                </div>
                <div className="card__meta-body">
                  <div className="card__meta-body-title"><a className="card__meta-body-link card__meta-body-link--instagram" href="https://www.instagram.com/muikkuofficial/" target="_blank">muikkuofficial</a></div>
                  <div className="card__meta-body-description">{this.props.i18n.text.get('plugin.studying.nettilukio.title')} / {this.props.i18n.text.get('plugin.studying.nettiperuskoulu.title')}</div>
                </div>
              </div>
              <InstagramFeed userId={INSTAGRAM_ID} thumbnailWidth={THUMBNAIL_WIDTH} photoCount={PHOTO_COUNT}/>
            </div>
          </div>
        </div>
     </div>
    </section>
  }
}
