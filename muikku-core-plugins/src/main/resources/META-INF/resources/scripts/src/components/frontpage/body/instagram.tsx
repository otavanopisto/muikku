import * as React from "react";
import InstagramGallery from '../../general/instagram-feed';
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
              <InstagramGallery userId={INSTAGRAM_ID} thumbnailWidth={THUMBNAIL_WIDTH} photoCount={PHOTO_COUNT}/>
            </div>
          </div>
        </div>
     </div>
    </section>
  }
}