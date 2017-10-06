import FrontpageNavbar from './navbar';
import FrontpageFeed from './feed';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import $ from '~/lib/jquery';

import '~/sass/elements/container.scss';
import '~/sass/elements/hero.scss';
import '~/sass/elements/bubble.scss';
import '~/sass/elements/separator.scss';
import '~/sass/elements/screen-container.scss';
import '~/sass/elements/logo.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/card.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/carousel.scss';
import '~/sass/elements/footer.scss';

interface FrontpageBodyProps {
  i18n: i18nType
}

interface FrontpageBodyState {
  
}

class FrontpageBody extends React.Component<FrontpageBodyProps, FrontpageBodyState> {
  componentDidMount(){
    this.addCarousels();
  }
  addCarousels(){
    //TODO this piece of code us deprecated and uses jquery, notice that this
    //will be very buggy if ever the frontpage body updates, eg making the i18 reducer more efficient
    //or adding another reducer that causes changes to the body properties
    //we need to repace this if ever going to make body to update
      
    $('<link/>', {
      rel: 'stylesheet',
      type: 'text/css',
      href: '//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.css'
    }).appendTo('head');
      
    $.getScript("//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.min.js", function(data: any, textStatus: string, jqxhr: any) {
      $(".carousel__item").each((index: number, element: HTMLElement)=>{
        $(element).show();
      });

      $(".carousel").each((index: number, element: HTMLElement)=>{
        $(element).slick({
          appendDots: $(element).siblings(".carousel__controls"),
          arrows: false,
          dots: true,
          dotsClass: "carousel__dots",
          fade: true,
          speed: 750,
          waitForAnimate: false,
          responsive: [
             {
              breakpoint: 769,
              settings: {
                adaptiveHeight: true,
                fade: false
              }
            }
          ]
        });
      });
    });
  }
  render(){
    return (<div className="container container--full">
<FrontpageNavbar />
            
<header className="hero hero--frontpage">
  <div className="hero__wrapper">
    <div className="hero__wrapper__item">
      <div className="bubble bubble--responsive">
        <div className="bubble__title">
          {this.props.i18n.text.get('plugin.header.studentApplicationBubble.title')}
        </div>
        <div className="bubble__content">
          {this.props.i18n.text.get('plugin.header.studentApplicationBubble.description')}
        </div>
        <div className="bubble__button-container">
          <a className="button button--frontpage-bubble button--warn">
            {this.props.i18n.text.get('plugin.header.studentApplicationBubble.link')}
          </a>
        </div>
      </div>
    </div>
    <div className="hero__wrapper__item">
      <div className="container container--muikku-logo">
        <img className="logo logo--muikku-verkko" src="/gfx/of-site-logo.png"></img>
        <div className="text">
          <div className="text text--frontpage-muikku-author">{this.props.i18n.text.get('plugin.header.site.author')}</div>
          <div className="text text--frontpage-muikku">MUIKKU</div>
          <div className="text text--frontpage-verkko">VERKKO</div>
        </div>
      </div>
      <div className="text text--frontpage-muikku-description">{this.props.i18n.text.get('plugin.header.site.description')}</div>
    </div>
    <div className="hero__wrapper__item">
      <div className="bubble bubble--responsive">
        <div className="bubble__title">{this.props.i18n.text.get('plugin.header.openMaterialsBubble.title')}</div>
        <div className="bubble__content">{this.props.i18n.text.get('plugin.header.openMaterialsBubble.description')}</div>
        <div className="bubble__button-container">
          <a className="button button--frontpage-bubble button--warn">{this.props.i18n.text.get('plugin.header.openMaterialsBubble.link')}</a>
        </div>
      </div>
    </div>
  </div>
</header>

<div className="separator separator--frontpage"></div>

<div className="screen-container">
  <div className="screen-container__wrapper">
          
    <section id="studying" className="container container--frontpage-section">
      <h2 className="text text--frontpage-title">{this.props.i18n.text.get('plugin.sectionTitle.studying')}</h2>
      <div className="ordered-container ordered-container--row ordered-container--responsive ordered-container--frontpage-studying">
        <div className="ordered-container__item">
          <div className="card card--frontpage-studying">
            <img className="card__image" src="/gfx/kuva_nettilukio.png" alt=""
              title="" />
            <div className="card__content">
              <div className="card__title">{this.props.i18n.text.get('plugin.studying.nettilukio.title')}</div>
              <div className="card__text">{this.props.i18n.text.get('plugin.studying.nettilukio.description')}</div>
            </div>
            <div className="card__footer">
              <a href="http://www.nettilukio.fi/nettilukio_esittely"
                className="button button--frontpage-studying-readmore">
                {this.props.i18n.text.get('plugin.studying.readMore.link')} </a>
            </div>
          </div>
        </div>
        <div className="ordered-container__item">
          <div className="card card--frontpage-school">
            <img className="card__image" src="/gfx/kuva_nettiperuskoulu.png"
              alt="" title="" />
            <div className="card__content">
              <div className="card__title">{this.props.i18n.text.get('plugin.studying.nettiperuskoulu.title')}</div>
              <div className="card__text">{this.props.i18n.text.get('plugin.studying.nettiperuskoulu.description')}</div>
            </div>
            <div className="card__footer">
              <a href="http://www.nettilukio.fi/esittely_nettipk"
                className="button button--frontpage-school-readmore">
                {this.props.i18n.text.get('plugin.studying.readMore.link')} </a>
            </div>
          </div>
        </div>
        <div className="ordered-container__item">
          <div className="card card--frontpage-courses">
            <img className="card__image" src="/gfx/kuva_aineopiskelu.png"
              alt="" title="" />
            <div className="card__content">
              <div className="card__title">{this.props.i18n.text.get('plugin.studying.aineopiskelu.title')}</div>
              <div className="card__text">{this.props.i18n.text.get('plugin.studying.aineopiskelu.description')}</div>
            </div>
            <div className="card__footer">
              <a href="http://www.nettilukio.fi/esittely_nettipk"
                className="button button--frontpage-courses-readmore">
                {this.props.i18n.text.get('plugin.studying.readMore.link')} </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="videos" className="container container--frontpage-section">
      <div className="carousel">
        <div className="carousel__item">
          <div className="carousel__item__video">
            <iframe width="1280" height="720"
              src="https://www.youtube.com/embed/OD5Oj50vyh0?rel=0&amp;showinfo=0"
              style={{border: 0, allowfullscreen:"allowfullscreen"}}></iframe>
          </div>
        </div>
        <div className="carousel__item" style={{display:"none"}}>
          <div className="carousel__item__video">
            <iframe width="1280" height="720"
              src="https://www.youtube.com/embed/CJcpWZD0VT8?rel=0&amp;showinfo=0"
            style={{border: 0, allowfullscreen:"allowfullscreen"}}></iframe>
          </div>
        </div>
        <div className="carousel__item" style={{display:"none"}}>
          <div className="carousel__item__video">
            <iframe width="1280" height="720"
              src="https://www.youtube.com/embed/EbJnWIyOJNg?rel=0&amp;showinfo=0"
            style={{border: 0, allowfullscreen:"allowfullscreen"}}></iframe>
          </div>
        </div>
        <div className="carousel__item" style={{display:"none"}}>
          <div className="carousel__item__video">
            <iframe width="1280" height="720"
              src="https://www.youtube.com/embed/iOKUoAAQ7Uk?rel=0&amp;showinfo=0"
            style={{border: 0, allowfullscreen:"allowfullscreen"}}></iframe>
          </div>
        </div>
      </div>
      <div className="carousel__controls"></div>
    </section>

    <section id="news" className="container container--frontpage-section">

      <h2 className="frontpage text frontpage-text-title">{this.props.i18n.text.get('plugin.sectionTitle.news')}</h2>

      <div className="ordered-container ordered-container--frontpage-news">

        <div className="ordered-container__item">
          <div className="ordered-container ordered-container--row ordered-container--responsive ordered-container--frontpage-news-subcontainer">

            <div className="ordered-container__item">
              <div className="card">
                <div className="card__content">
                  <h2 className="card__title">{this.props.i18n.text.get('plugin.frontpageBoxTitle.events')}</h2>
                  <div className="frontpage-events-container">
                    <FrontpageFeed queryOptions={{numItems: 4, order: "ASCENDING"}} feedReadTarget="ooevents"></FrontpageFeed>
                  </div>
                </div>
              </div>
            </div>

            <div className="ordered-container__item">
              <div className="card">
                <div className="card__content">
                  <h2 className="card__title">{this.props.i18n.text.get('plugin.frontpageBoxTitle.news')}</h2>
                  <div className="frontpage-news-container">
                    <FrontpageFeed queryOptions={{numItems: 5}} feedReadTarget="oonews"></FrontpageFeed>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="ordered-container__item">
          <div className="ordered-container ordered-container--row ordered-container--responsive ordered-container--frontpage-news-subcontainer">

            <div className="ordered-container__item">
              <div className="card">
                <div className="carousel">
                  <div className="carousel__item">
                    <img className="card__image" src="/gfx/kuva1.jpg" alt="" title="" />
                    <div className="card__content">
                      <div className="card__text">{this.props.i18n.text.get('plugin.images.description.image1')}</div>
                    </div>
                  </div>

                  <div className="carousel__item" style={{display:"none"}}>
                    <img className="card__image" src="/gfx/kuva2.jpg" alt=""
                      title="" />
                    <div className="card__content">
                      <div className="card__text">{this.props.i18n.text.get('plugin.images.description.image2')}</div>
                    </div>
                  </div>

                  <div className="carousel__item" style={{display:"none"}}>
                    <img className="card__image" src="/gfx/kuva3.jpg" alt="" title="" />
                    <div className="card__content">
                      <div className="card__text">{this.props.i18n.text.get('plugin.images.description.image3')}</div>
                    </div>
                  </div>

                  <div className="carousel__item" style={{display:"none"}}>
                    <img className="card__image" src="/gfx/kuva4.jpg" alt=""
                      title="" />
                    <div className="card__content">
                      <div className="card__text">{this.props.i18n.text.get('plugin.images.description.image4')}</div>
                    </div>
                  </div>

                  <div className="carousel__item" style={{display:"none"}}>
                    <img className="card__image" src="/gfx/kuva5.jpg" alt=""
                      title="" />
                    <div className="card__content">
                      <div className="card__text">
                        {this.props.i18n.text.get('plugin.images.description.image5')}</div>
                    </div>
                  </div>
                </div>
                <div className="carousel__controls"></div>
              </div>
            </div>

            <div className="ordered-container__item">
              <div className="card">
                <div className="card__content">
                  <h2 className="card__title">{this.props.i18n.text.get('plugin.frontpageBoxTitle.blogs')}</h2>
                  <div className="frontpage-blogs-container">
                    <FrontpageFeed queryOptions={{numItems: 6}}
                     feedReadTarget="eoppimiskeskus,open,ebarometri,matskula,oppiminen,polkuja,reissuvihko,jalkia"></FrontpageFeed>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="organization" className="container container--frontpage-section">

      <div className="card card--frontpage-otavan-opisto">

        <div className="ordered-container ordered-container--frontpage-otavan-opisto-info">
          <div className="ordered-container__item ordered-container__item--otavan-opisto-social-media">

            <div className="container container--otavan-opisto-social-media">
              <h2 className="text text--otavan-opisto-info-title">
                {this.props.i18n.text.get('plugin.organization.some.title')}
              </h2>
              <a className="button-social icon icon-some-facebook" href="https://www.facebook.com/otavanopisto" target="top"></a>
              <a className="button-social icon icon-some-twitter" href="https://twitter.com/OtavanOpisto" target="top"></a>
              <a className="button-social icon icon-some-instagram" href="https://www.instagram.com/otavanopisto/" target="top"></a>
              <a className="button-social icon icon-some-pinterest" href="https://fi.pinterest.com/otavanopisto/" target="top"></a>
              <a className="button-social icon icon-some-linkedin" href="https://www.linkedin.com/company/106028" target="top"></a>
            </div>

            <div className="container container--otavan-opisto-description">
              <div className="text text--otavan-opisto-info-description"
                dangerouslySetInnerHTML={{__html: this.props.i18n.text.get('plugin.organization.description')}}>
              </div>
              <a href="http://www.otavanopisto.fi" target="top" className="button button--frontpage-website">
                www.otavanopisto.fi
              </a>
              <br/>
              <a href="http://www.otavanopisto.fi/uutiskirje" target="top" className="button button--frontpage-newsletter">
                {this.props.i18n.text.get('plugin.organization.newsletter.link')}
              </a>
            </div>
          </div>

          <div className="ordered-container__item ordered-container__item--frontpage-otavan-opisto-logo">
            <img src="/gfx/of-organization-logo.jpg" alt="logo" title="logo" />
          </div>
        </div>

      </div>
    </section>
  </div>
</div>

<footer className="footer" id="contact">
  <div className="footer__container">
    <div className="footer__item footer__item--contact">
      <h2 className="text text--contact-us">{this.props.i18n.text.get('plugin.footer.contact.title')}</h2>
      <p className="text text--contact-us-information">
        <span className="text__icon icon-location"></span>
        <b>{this.props.i18n.text.get('plugin.footer.streetAddress.label')}</b>
        <span>Otavantie 2 B, 50670 Otava</span>
      </p>
      <p className="text text--contact-us-information">
        <span className="text-icon icon-phone"></span>
        <b>{this.props.i18n.text.get('plugin.footer.phoneNumber.label')}</b>
        <span>015 194 3552</span>
      </p>
      <p className="text text--contact-us-information">
        <span className="text-icon icon-envelope"></span>
        <b>{this.props.i18n.text.get('plugin.footer.emailAddress.label')}</b>
        <span>info@otavanopisto.fi</span>
      </p>
    </div>
    <div className="footer__item footer__item--logos">
      <img src="/gfx/alku_uudelle.jpg" alt="" title="" className="logo" />
      <img src="/gfx/footer_logo.jpg" alt="" title="" className="logo" />
    </div>
  </div>
</footer>
        </div>);
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(FrontpageBody);