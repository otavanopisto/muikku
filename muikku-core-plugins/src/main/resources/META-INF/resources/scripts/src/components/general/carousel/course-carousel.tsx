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
import { Suggestion } from "../../../@types/shared";
import Carousel from "react-multi-carousel";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
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
      draggable={true}
      showDots={false}
      responsive={responsive}
      infinite={true}
      autoPlaySpeed={2000}
      keyBoardControl={true}
      transitionDuration={2000}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item--courses"
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

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  const createHtmlMarkup = (htmlString: string) => ({
    __html: htmlString,
  });

  const courseImage = course.hasCustomImage
    ? `url(/rest/workspace/workspaces/${course.id}/workspacefile/workspace-frontpage-image-cropped)`
    : "url(/gfx/workspace-default-header.jpg)";

  return (
    <div className="carousel-itemV2--courses">
      <div
        className="carousel-itemV2__image-section--courses"
        style={{ backgroundImage: courseImage }}
      >
        <h3>{course.name}</h3>

        {course.nameExtension !== null && <h2>{course.nameExtension}</h2>}
      </div>

      <div className="carousel-itemV2__container-section--courses">
        <div className="carousel-itemV2__container-content--courses">
          {course.description ? (
            <div
              dangerouslySetInnerHTML={createHtmlMarkup(course.description)}
            />
          ) : (
            <p>-</p>
          )}
        </div>
        <div className="carousel-itemV2__container-functions--courses">
          <Button
            aria-label={course.name}
            buttonModifiers={[
              "primary-function-content ",
              "coursepicker-course-action",
            ]}
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
              buttonModifiers={[
                "primary-function-content",
                "coursepicker-course-action",
              ]}
            >
              Ilmoittaudu
            </Button>
          </WorkspaceSignup>
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
