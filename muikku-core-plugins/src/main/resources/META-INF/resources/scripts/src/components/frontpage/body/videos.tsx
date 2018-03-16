import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Carousel, { CarouselVideoItem } from "~/components/general/carousel";

interface FrontpageVideosProps {
  
}

interface FrontpageVideosState {

}

export default class FrontpageVideos extends React.Component<FrontpageVideosProps, FrontpageVideosState> {
  render() {
    return <section id="videos" className="container container--frontpage-section">
      <Carousel>
        <CarouselVideoItem>
          <iframe width="1280" height="720"
            src="https://www.youtube.com/embed/tTlLURdl0rA?rel=0&amp;showinfo=0"
            style={{ border: 0, allowfullscreen: "allowfullscreen" }}></iframe>
        </CarouselVideoItem>
        <CarouselVideoItem>
          <iframe width="1280" height="720"
            src="https://www.youtube.com/embed/CJcpWZD0VT8?rel=0&amp;showinfo=0"
            style={{ border: 0, allowfullscreen: "allowfullscreen" }}></iframe>
        </CarouselVideoItem>
        <CarouselVideoItem>
          <iframe width="1280" height="720"
            src="https://www.youtube.com/embed/EbJnWIyOJNg?rel=0&amp;showinfo=0"
            style={{ border: 0, allowfullscreen: "allowfullscreen" }}></iframe>
        </CarouselVideoItem>
        <CarouselVideoItem>
          <iframe width="1280" height="720"
            src="https://www.youtube.com/embed/iOKUoAAQ7Uk?rel=0&amp;showinfo=0"
            style={{ border: 0, allowfullscreen: "allowfullscreen" }}></iframe>
        </CarouselVideoItem>
      </Carousel>
    </section>
  }
}