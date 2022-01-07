/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import { CarouselProvider, Slider, Slide, DotGroup } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import "~/sass/elements/carousel.scss";

interface CarouselProps {
  totalSlides: number;
  naturalSlideWidth: number;
  naturalSlideHeight: number;
}

interface CarouselState {}

export default class Carousel extends React.Component<
  CarouselProps,
  CarouselState
> {
  constructor(props: CarouselProps) {
    super(props);
  }

  render() {
    return (
      <div ref="carouselBaseRef">
        <CarouselProvider
          naturalSlideWidth={this.props.naturalSlideWidth}
          naturalSlideHeight={this.props.naturalSlideHeight}
          totalSlides={this.props.totalSlides}
        >
          <Slider>{this.props.children}</Slider>
          <div className="carousel__controls">
            <DotGroup className="carousel__dots" />
          </div>
        </CarouselProvider>
      </div>
    );
  }
}

export class CarouselItem extends React.Component<
  { index: number },
  Record<string, unknown>
> {
  render() {
    return (
      <Slide index={this.props.index}>
        <div className="carousel__item">{this.props.children}</div>
      </Slide>
    );
  }
}

export class CarouselVideoItem extends React.Component<
  { index: number },
  Record<string, unknown>
> {
  render() {
    return (
      <Slide index={this.props.index}>
        <div className="carousel__item carousel__item-video">
          {this.props.children}
        </div>
      </Slide>
    );
  }
}
