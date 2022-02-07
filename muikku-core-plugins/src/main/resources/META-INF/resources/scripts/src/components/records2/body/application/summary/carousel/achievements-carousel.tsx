import "~/sass/elements/carousel.scss";
import * as React from "react";
import Carousel from "react-multi-carousel";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
};

/**
 * CarouselProps
 */
interface AchievementsCarouselProps {
  achievements: Achievement[];
}

/**
 * Carousel
 * @param props props
 * @returns JSX.Element
 */
const AchievementsCarousel: React.FC<AchievementsCarouselProps> = (props) => {
  const carouselItems = props.achievements.map((aItem) => (
    <AchievementsCarouselItem key={aItem.id} achievement={aItem} />
  ));

  return (
    <Carousel
      swipeable={true}
      draggable={true}
      responsive={responsive}
      autoPlaySpeed={2000}
      keyBoardControl={true}
      transitionDuration={2000}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item--achievement"
    >
      {carouselItems}
    </Carousel>
  );
};

/**
 * Course
 */
export interface Achievement {
  id: number;
  status: "ONGOING" | "DONE";
  courseIndex: number;
  name: string;
  description: string;
  imageSrc?: string;
}

/**
 * CourseCarouselItemProps
 */
interface CourseCarouselItemProps {
  achievement: Achievement;
}

/**
 * CourseCarouselItem
 * @param props props
 * @returns JSX.Element
 */
const AchievementsCarouselItem: React.FC<CourseCarouselItemProps> = (props) => {
  const { achievement } = props;

  return (
    <div className="carousel-itemV2--achievement">
      <div className="carousel-itemV2__image-section--achievement">
        <img
          src={achievement.imageSrc}
          alt="no-image"
          className="image-section__img"
        />
      </div>
    </div>
  );
};

export default AchievementsCarousel;
