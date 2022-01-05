import * as React from "react";
import Carousel, { CarouselVideoItem } from "~/components/general/carousel";
import { i18nType } from "~/reducers/base/i18n";

interface FrontpageVideosProps {
  i18n: i18nType;
}

interface FrontpageVideosState {}

export default class FrontpageVideos extends React.Component<
  FrontpageVideosProps,
  FrontpageVideosState
> {
  render() {
    return (
      <section
        id="videos"
        className="screen-container__section"
        aria-label={this.props.i18n.text.get(
          "plugin.wcag.frontPageSectionVideosLabel"
        )}
      >
        <Carousel
          naturalSlideHeight={720}
          naturalSlideWidth={1280}
          totalSlides={3}
        >
          <CarouselVideoItem index={0}>
            <iframe
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/IvP595DJ5fM?rel=0&amp;showinfo=0"
              style={{ border: 0 }}
              allowFullScreen={true}
              title="Nettilukio.fi - Treenien rinnalla | Robert Ven"
            ></iframe>
          </CarouselVideoItem>
          <CarouselVideoItem index={1}>
            <iframe
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/CJcpWZD0VT8?rel=0&amp;showinfo=0"
              style={{ border: 0 }}
              allowFullScreen={true}
              title="Nettilukiolaisten ajatuksia"
            ></iframe>
          </CarouselVideoItem>
          <CarouselVideoItem index={2}>
            <iframe
              width="1280"
              height="720"
              src="https://www.youtube.com/embed/iOKUoAAQ7Uk?rel=0&amp;showinfo=0"
              style={{ border: 0 }}
              allowFullScreen={true}
              title="Nettilukio: helppoa ja kätevää?"
            ></iframe>
          </CarouselVideoItem>
        </Carousel>
      </section>
    );
  }
}
