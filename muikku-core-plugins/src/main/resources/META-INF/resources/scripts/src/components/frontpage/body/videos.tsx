import * as React from "react";
import Carousel, { CarouselVideoItem } from "~/components/general/carousel";

interface FrontpageVideosProps {

}

interface FrontpageVideosState {

}

export default class FrontpageVideos extends React.Component<FrontpageVideosProps, FrontpageVideosState> {
  render() {
    return <section id="videos" className="screen-container__section">
      <Carousel>
        <CarouselVideoItem>
          <iframe width="1280" height="720"
            src="https://www.youtube.com/embed/IvP595DJ5fM?rel=0&amp;showinfo=0"
            style={{ border: 0 }}
            allowFullScreen={true}></iframe>
        </CarouselVideoItem>
        <CarouselVideoItem>
          <iframe width="1280" height="720"
            src="https://www.youtube.com/embed/CJcpWZD0VT8?rel=0&amp;showinfo=0"
            style={{ border: 0 }}
            allowFullScreen={true}></iframe>
        </CarouselVideoItem>
        <CarouselVideoItem>
          <iframe width="1280" height="720"
            src="https://www.youtube.com/embed/iOKUoAAQ7Uk?rel=0&amp;showinfo=0"
            style={{ border: 0 }}
            allowFullScreen={true}></iframe>
        </CarouselVideoItem>
      </Carousel>
    </section>
  }
}
