import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import "react-multi-carousel/lib/styles.css";
import "~/sass/elements/carousel.scss";
import * as React from "react";
import Button from "~/components/general/button";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { useCourseCarousel } from "./hooks/use-course-carousel";
import WorkspaceSignup from "~/components/coursepicker/dialogs/workspace-signup";
import { Suggestion } from "~/@types/shared";
import Carousel from "react-multi-carousel";
import WorkspaceDescriptionDialog from "./workspace-description-dialog";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1023, min: 768 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobilexl: {
    breakpoint: { max: 767, min: 640 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 639, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

/**
 * CarouselProps
 */
interface CourseCarouselProps {
  studentId: string;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Carousel
 * @param props props
 * @returns JSX.Element
 */
const CourseCarousel: React.FC<CourseCarouselProps> = (props) => {
  const { courseCarousel } = useCourseCarousel(
    props.studentId,
    props.displayNotification
  );

  if (courseCarousel.isLoading) {
    return <div className="loader-empty" />;
  }

  const carouselItems = courseCarousel.carouselItems.map((cItem) => (
    <CourseCarouselItem key={cItem.id} course={cItem} />
  ));

  return (
    <Carousel
      autoPlay={false}
      swipeable={true}
      draggable={false}
      showDots
      renderDotsOutside
      responsive={responsive}
      infinite={true}
      autoPlaySpeed={2000}
      keyBoardControl={true}
      transitionDuration={100}
      containerClass="carousel swiper-no-swiping"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="carousel__dots-list"
      itemClass="carousel__item carousel__item--course"
    >
      {carouselItems}
    </Carousel>
  );
};

/**
 * Course
 */
export interface Course extends Suggestion {}

/**
 * CourseCarouselItemProps
 */
interface CourseCarouselItemProps {
  course: Course;
  suggestedBySupervisor?: boolean;
}

/**
 * CourseCarouselItem
 * @param props props
 * @returns JSX.Element
 */
const CourseCarouselItem: React.FC<CourseCarouselItemProps> = (props) => {
  const { course } = props;

  const courseImage = course.hasCustomImage
    ? `url(/rest/workspace/workspaces/${course.id}/workspacefile/workspace-frontpage-image-cropped)`
    : "url(/gfx/workspace-default-header.jpg)";

  return (
    <div className="carousel__item-container">
      <div className="carousel__item-hero">
        <div
          className="carousel__item-image carousel__item-image--course"
          style={{ backgroundImage: courseImage }}
        ></div>
      </div>
      <div className="carousel__item-details">
        <div className="carousel__item-title carousel__item-title--course">
          {course.name}{" "}
          {course.nameExtension !== null && (
            <span className="carousel__item-additional-title">
              ({course.nameExtension})
            </span>
          )}
        </div>

        <div className="carousel__item-actions carousel__item-actions--course">
          <Button
            aria-label={course.name}
            buttonModifiers={["studies-course-action"]}
            href={`/workspace/${course.urlName}`}
          >
            Tutustu
          </Button>

          <WorkspaceSignup
            workspaceSignUpDetails={{
              id: course.id,
              name: course.name,
              nameExtension: course.nameExtension,
              urlName: course.urlName,
            }}
          >
            <Button
              aria-label={course.name}
              buttonModifiers={["studies-course-action"]}
            >
              Ilmoittaudu
            </Button>
          </WorkspaceSignup>

          {course.description && (
            <WorkspaceDescriptionDialog course={course}>
              <Button
                aria-label={course.name}
                buttonModifiers={["studies-course-action"]}
              >
                Kuvaus
              </Button>
            </WorkspaceDescriptionDialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
