import FrontpageNavbar from './navbar.tsx';
import FrontpageFeed from './feed.tsx';
import * as React from 'react';
import {connect} from 'react-redux';
import {i18nType} from '~/reducers';

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
      
    $.getScript("//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.min.js", function( data, textStatus, jqxhr ) {
      $(".carousel-item").each((index, element)=>{
        $(element).show();
      });

      $(".carousel").each((index, element)=>{
        $(element).slick({
          appendDots: $(element).siblings(".carousel-controls"),
          arrows: false,
          dots: true,
          dotsClass: "carousel-dots",
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
    return (<div className="embbed embbed-full">
<FrontpageNavbar />
            
<header className="frontpage hero">
  <div className="hero-wrapper">
    <div className="hero-item">
      <div className="bubble bubble-responsive">
        <div className="bubble-title">
          {this.props.i18n.text.get('plugin.header.studentApplicationBubble.title')}
        </div>
        <div className="bubble-content">
          {this.props.i18n.text.get('plugin.header.studentApplicationBubble.description')}
        </div>
        <div className="bubble-button-container">
          <a className="button button-soft button-dynamic-height button-warn button-focus">
            {this.props.i18n.text.get('plugin.header.studentApplicationBubble.link')}
          </a>
        </div>
      </div>
    </div>
    <div className="hero-item">
      <div className="frontpage container frontpage-container-muikku-logo">
        <img className="frontpage logo frontpage-logo-muikku-verkko" src="/gfx/of-site-logo.png"></img>
        <div className="frontpage text text-uppercase">
          <div className="frontpage text frontpage-text-muikku-author">{this.props.i18n.text.get('plugin.header.site.author')}</div>
          <div className="frontpage text frontpage-text-muikku">MUIKKU</div>
          <div className="frontpage text frontpage-text-verkko">VERKKO</div>
        </div>
      </div>
      <div className="frontpage text text-uppercase frontpage-text-muikku-description">{this.props.i18n.text.get('plugin.header.site.description')}</div>
    </div>
    <div className="hero-item">
      <div className="bubble bubble-responsive">
        <div className="bubble-title">{this.props.i18n.text.get('plugin.header.openMaterialsBubble.title')}</div>
        <div className="bubble-content">{this.props.i18n.text.get('plugin.header.openMaterialsBubble.description')}</div>
        <div className="bubble-button-container">
          <a className="button button-soft button-dynamic-height button-warn">{this.props.i18n.text.get('plugin.header.openMaterialsBubble.link')}</a>
        </div>
      </div>
    </div>
  </div>
</header>

<div className="frontpage separator"></div>

<div className="screen-container">
  <div className="screen-container-wrapper">
          
    <section id="studying" className="frontpage container frontpage-container-section">
      <h2 className="frontpage text frontpage-text-title">{this.props.i18n.text.get('plugin.sectionTitle.studying')}</h2>
      <div className="frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-studying">
        <div className="ordered-container-item">
          <div className="frontpage card frontpage-card-studying">
            <img className="card-image" src="/gfx/kuva_nettilukio.png" alt=""
              title="" />
            <div className="card-content">
              <div className="card-title">{this.props.i18n.text.get('plugin.studying.nettilukio.title')}</div>
              <div className="card-text">{this.props.i18n.text.get('plugin.studying.nettilukio.description')}</div>
            </div>
            <div className="card-footer">
              <a href="http://www.nettilukio.fi/nettilukio_esittely"
                className="frontpage button frontpage-button-studying-readmore">
                {this.props.i18n.text.get('plugin.studying.readMore.link')} </a>
            </div>
          </div>
        </div>
        <div className="ordered-container-item">
          <div className="frontpage card frontpage-card-school">
            <img className="card-image" src="/gfx/kuva_nettiperuskoulu.png"
              alt="" title="" />
            <div className="card-content">
              <div className="card-title">{this.props.i18n.text.get('plugin.studying.nettiperuskoulu.title')}</div>
              <div className="card-text">{this.props.i18n.text.get('plugin.studying.nettiperuskoulu.description')}</div>
            </div>
            <div className="card-footer">
              <a href="http://www.nettilukio.fi/esittely_nettipk"
                className="frontpage button frontpage-button-school-readmore">
                {this.props.i18n.text.get('plugin.studying.readMore.link')} </a>
            </div>
          </div>
        </div>
        <div className="ordered-container-item">
          <div className="frontpage card frontpage-card-courses">
            <img className="card-image" src="/gfx/kuva_aineopiskelu.png"
              alt="" title="" />
            <div className="card-content">
              <div className="card-title">{this.props.i18n.text.get('plugin.studying.aineopiskelu.title')}</div>
              <div className="card-text">{this.props.i18n.text.get('plugin.studying.aineopiskelu.description')}</div>
            </div>
            <div className="card-footer">
              <a href="http://www.nettilukio.fi/esittely_nettipk"
                className="frontpage button frontpage-button-courses-readmore">
                {this.props.i18n.text.get('plugin.studying.readMore.link')} </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="videos" className="frontpage container frontpage-container-section">
      <div className="carousel">
        <div className="carousel-item">
          <div className="carousel-video">
            <iframe width="1280" height="720"
              src="https://www.youtube.com/embed/OD5Oj50vyh0?rel=0&amp;showinfo=0"
              style={{border: 0, allowfullscreen:"allowfullscreen"}}></iframe>
          </div>
        </div>
        <div className="carousel-item" style={{display:"none"}}>
          <div className="carousel-video">
            <iframe width="1280" height="720"
              src="https://www.youtube.com/embed/CJcpWZD0VT8?rel=0&amp;showinfo=0"
            style={{border: 0, allowfullscreen:"allowfullscreen"}}></iframe>
          </div>
        </div>
        <div className="carousel-item" style={{display:"none"}}>
          <div className="carousel-video">
            <iframe width="1280" height="720"
              src="https://www.youtube.com/embed/EbJnWIyOJNg?rel=0&amp;showinfo=0"
            style={{border: 0, allowfullscreen:"allowfullscreen"}}></iframe>
          </div>
        </div>
        <div className="carousel-item" style={{display:"none"}}>
          <div className="carousel-video">
            <iframe width="1280" height="720"
              src="https://www.youtube.com/embed/iOKUoAAQ7Uk?rel=0&amp;showinfo=0"
            style={{border: 0, allowfullscreen:"allowfullscreen"}}></iframe>
          </div>
        </div>
      </div>
      <div className="carousel-controls"></div>
    </section>

    <section id="news" className="frontpage container frontpage-container-section">

      <h2 className="frontpage text frontpage-text-title">{this.props.i18n.text.get('plugin.sectionTitle.news')}</h2>

      <div className="frontpage ordered-container frontpage-ordered-container-news">

        <div className="ordered-container-item">
          <div className="frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-news-subcontainer">

            <div className="ordered-container-item">
              <div className="card">
                <div className="card-content">
                  <h2 className="card-title">{this.props.i18n.text.get('plugin.frontpageBoxTitle.events')}</h2>
                  <div className="frontpage-events-container">
                    <FrontpageFeed queryOptions={{numItems: 4, order: "ASCENDING"}} feedReadTarget="ooevents"></FrontpageFeed>
                  </div>
                </div>
              </div>
            </div>

            <div className="ordered-container-item">
              <div className="card">
                <div className="card-content">
                  <h2 className="card-title">{this.props.i18n.text.get('plugin.frontpageBoxTitle.news')}</h2>
                  <div className="frontpage-news-container">
                    <FrontpageFeed queryOptions={{numItems: 5}} feedReadTarget="oonews"></FrontpageFeed>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="ordered-container-item">
          <div className="frontpage ordered-container ordered-container-row ordered-container-responsive frontpage-ordered-container-news-subcontainer">

            <div className="ordered-container-item frontpage-card-container">
              <div className="card">
                <div className="carousel">
                  <div className="carousel-item">
                    <img className="card-image" src="/gfx/kuva1.jpg" alt="" title="" />
                    <div className="card-content">
                      <div className="card-text">{this.props.i18n.text.get('plugin.images.description.image1')}</div>
                    </div>
                  </div>

                  <div className="carousel-item" style={{display:"none"}}>
                    <img className="card-image" src="/gfx/kuva2.jpg" alt=""
                      title="" />
                    <div className="card-content">
                      <div className="card-text">{this.props.i18n.text.get('plugin.images.description.image2')}</div>
                    </div>
                  </div>

                  <div className="carousel-item" style={{display:"none"}}>
                    <img className="card-image" src="/gfx/kuva3.jpg" alt="" title="" />
                    <div className="card-content">
                      <div className="card-text">{this.props.i18n.text.get('plugin.images.description.image3')}</div>
                    </div>
                  </div>

                  <div className="carousel-item" style={{display:"none"}}>
                    <img className="card-image" src="/gfx/kuva4.jpg" alt=""
                      title="" />
                    <div className="card-content">
                      <div className="card-text">{this.props.i18n.text.get('plugin.images.description.image4')}</div>
                    </div>
                  </div>

                  <div className="carousel-item" style={{display:"none"}}>
                    <img className="card-image" src="/gfx/kuva5.jpg" alt=""
                      title="" />
                    <div className="card-content">
                      <div className="card-text">
                        {this.props.i18n.text.get('plugin.images.description.image5')}</div>
                    </div>
                  </div>
                </div>
                <div className="carousel-controls"></div>
              </div>
            </div>

            <div className="ordered-container-item frontpage-card-container">
              <div className="card">
                <div className="card-content">
                  <h2 className="card-title">{this.props.i18n.text.get('plugin.frontpageBoxTitle.blogs')}</h2>
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

    <section id="organization" className="frontpage container frontpage-container-section frontpage-card-container">

      <div className="frontpage card frontpage-card-otavan-opisto">

        <div className="frontpage ordered-container frontpage-ordered-container-otavan-opisto-info">
          <div className="ordered-container-item frontpage-ordered-container-item-otavan-opisto-social-media">

            <div className="frontpage container frontpage-container-otavan-opisto-social-media">
              <h2 className="frontpage text text-uppercase frontpage-text-otavan-opisto-info-title">
                {this.props.i18n.text.get('plugin.organization.some.title')}
              </h2>
              <a className="frontpage button-social icon icon-some-facebook" href="https://www.facebook.com/otavanopisto" target="top"></a>
              <a className="frontpage button-social icon icon-some-twitter" href="https://twitter.com/OtavanOpisto" target="top"></a>
              <a className="frontpage button-social icon icon-some-instagram" href="https://www.instagram.com/otavanopisto/" target="top"></a>
              <a className="frontpage button-social icon icon-some-pinterest" href="https://fi.pinterest.com/otavanopisto/" target="top"></a>
              <a className="frontpage button-social icon icon-some-linkedin" href="https://www.linkedin.com/company/106028" target="top"></a>
            </div>

            <div className="frontpage container frontpage-container-otavan-opisto-description">
              <div className="frontpage text text-multiparagraph frontpage-text-otavan-opisto-info-description"
                dangerouslySetInnerHTML={{__html: this.props.i18n.text.get('plugin.organization.description')}}>
              </div>
              <a href="http://www.otavanopisto.fi" target="top" className="frontpage button frontpage-button-website">
                www.otavanopisto.fi
              </a>
              <br/>
              <a href="http://www.otavanopisto.fi/uutiskirje" target="top" className="frontpage button frontpage-button-newsletter">
                {this.props.i18n.text.get('plugin.organization.newsletter.link')}
              </a>
            </div>
          </div>

          <div className="ordered-container-item frontpage-ordered-container-item-otavan-opisto-logo">
            <img src="/gfx/of-organization-logo.jpg" alt="logo" title="logo" />
          </div>
        </div>

      </div>
    </section>
  </div>
</div>

<footer className="frontpage footer" id="contact">
  <div className="footer-container">
    <div className="footer-item frontpage-footer-item-contact">
      <h2 className="frontpage text frontpage-text-contact-us">{this.props.i18n.text.get('plugin.footer.contact.title')}</h2>
      <p className="frontpage text frontpage-text-contact-us-information">
        <span className="text-icon icon-location"></span>
        <b>{this.props.i18n.text.get('plugin.footer.streetAddress.label')}</b>
        <span>Otavantie 2 B, 50670 Otava</span>
      </p>
      <p className="frontpage text frontpage-text-contact-us-information">
        <span className="text-icon icon-phone"></span>
        <b>{this.props.i18n.text.get('plugin.footer.phoneNumber.label')}</b>
        <span>015 194 3552</span>
      </p>
      <p className="frontpage text frontpage-text-contact-us-information">
        <span className="text-icon icon-envelope"></span>
        <b>{this.props.i18n.text.get('plugin.footer.emailAddress.label')}</b>
        <span>info@otavanopisto.fi</span>
      </p>
    </div>
    <div className="footer-item frontpage-footer-item-logos">
      <img src="/gfx/alku_uudelle.jpg" alt="" title="" className="logo" />
      <img src="/gfx/footer_logo.jpg" alt="" title="" className="logo" />
    </div>
  </div>
</footer>
        </div>);
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrontpageBody);