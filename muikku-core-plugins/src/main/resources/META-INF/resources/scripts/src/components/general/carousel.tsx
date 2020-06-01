import * as React from "react";
import $ from '~/lib/jquery';

import '~/sass/elements/carousel.scss';

interface CarouselProps {

}

interface CarouselState {

}

//HAX
let forcedQueue:Array<()=>any> = [];
let scriptReady:boolean = false;

$('<link/>', {
  rel: 'stylesheet',
  type: 'text/css',
  href: '//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.css'
}).appendTo('head');

$.getScript("//cdn.muikkuverkko.fi/libs/slick/1.6.0/slick.min.js", function(data: any, textStatus: string, jqxhr: any) {
  scriptReady = true;
  forcedQueue.forEach(f=>f());
});

export default class Carousel extends React.Component<CarouselProps, CarouselState> {
  constructor(props: CarouselProps){
    super(props);

    this.configure = this.configure.bind(this);
    this.showCarouselItems = this.showCarouselItems.bind(this);
  }
  componentDidMount(){
    //HAXING
    if (!scriptReady){
      forcedQueue.push(this.configure.bind(this));
    } else {
      this.configure();
    }
  }
  showCarouselItems(){
    $(this.refs["carouselBaseRef"]).find(".carousel__item").each((index: number, element: HTMLElement)=>{
      $(element).show();
    });
  }
  componentDidUpdate(){
    this.showCarouselItems();
  }
  configure(){
    this.showCarouselItems();
    $(this.refs["carouselBaseRef"]).find(".carousel").slick({
      appendDots: $(this.refs["carouselBaseRef"]).find(".carousel__controls"),
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
  }

  render(){
    return <div ref="carouselBaseRef">
      <div className="carousel">
        {this.props.children}
      </div>
      <div className="carousel__controls"></div>
    </div>
  }
}

export class CarouselItem extends React.Component<{}, {}> {
  render(){
    return <div className="carousel__item" style={{display:"none"}}>{this.props.children}</div>
  }
}

export class CarouselVideoItem extends React.Component<{}, {}> {
  render(){
    return <div className="carousel__item" style={{display:"none"}}><div className="carousel__item-video">{this.props.children}</div></div>
  }
}
