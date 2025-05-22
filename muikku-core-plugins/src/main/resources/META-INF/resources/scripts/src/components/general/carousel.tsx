// /* eslint-disable react/no-string-refs */

// /**
//  * Depcrecated refs should be refactored
//  */

// import * as React from "react";
// import { CarouselProvider, Slider, Slide, DotGroup } from "pure-react-carousel";
// import "pure-react-carousel/dist/react-carousel.es.css";
// import "~/sass/elements/carousel.scss";

// /**
//  * CarouselProps
//  */
// interface CarouselProps {
//   totalSlides: number;
//   naturalSlideWidth: number;
//   naturalSlideHeight: number;
//   children: React.ReactNode;
// }

// /**
//  * CarouselState
//  */
// interface CarouselState {}

// /**
//  * Carousel
//  */
// export default class Carousel extends React.Component<
//   CarouselProps,
//   CarouselState
// > {
//   /**
//    * constructor
//    * @param props props
//    */
//   constructor(props: CarouselProps) {
//     super(props);
//   }

//   /**
//    * Component render method
//    * @returns React.JSX.Element
//    */
//   render() {
//     return (
//       <div ref="carouselBaseRef">
//         <CarouselProvider
//           naturalSlideWidth={this.props.naturalSlideWidth}
//           naturalSlideHeight={this.props.naturalSlideHeight}
//           totalSlides={this.props.totalSlides}
//         >
//           <Slider>{this.props.children}</Slider>
//           <div className="carousel__controls">
//             <DotGroup className="carousel__dots" />
//           </div>
//         </CarouselProvider>
//       </div>
//     );
//   }
// }

// /**
//  * CarouselItem
//  */
// export class CarouselItem extends React.Component<
//   { index: number },
//   Record<string, unknown>
// > {
//   /**
//    * Component render method
//    * @returns React.JSX.Element
//    */
//   render() {
//     return (
//       <Slide index={this.props.index}>
//         <div className="carousel__item">{this.props.children}</div>
//       </Slide>
//     );
//   }
// }

// /**
//  * CarouselVideoItem
//  */
// export class CarouselVideoItem extends React.Component<
//   { index: number },
//   Record<string, unknown>
// > {
//   /**
//    * Component render method
//    * @returns React.JSX.Element
//    */
//   render() {
//     return (
//       <Slide index={this.props.index}>
//         <div className="carousel__item carousel__item-video">
//           {this.props.children}
//         </div>
//       </Slide>
//     );
//   }
// }
