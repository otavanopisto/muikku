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
import { SuggestedCourse } from "~/@types/shared";
import Carousel from "react-multi-carousel";
import WorkspaceDescriptionDialog from "./workspace-description-dialog";
import { useTranslation } from "react-i18next";
import { CourseMatrix } from "~/generated/client";

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
  studentUserEntityId: number;
  studyProgrammeName: string;
  curriculumName: string;
  matrix: CourseMatrix;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Carousel
 * @param props props
 * @returns JSX.Element
 */
const CourseCarousel: React.FC<CourseCarouselProps> = (props) => {
  const { t } = useTranslation("courseCarousel");
  const { courseCarousel } = useCourseCarousel(
    props.studentId,
    props.studentUserEntityId,
    props.matrix,
    props.displayNotification
  );

  if (courseCarousel.isLoading) {
    return <div className="loader-empty" />;
  }

  if (courseCarousel.carouselItems === null) {
    return null;
  }

  if (courseCarousel.carouselItems.length === 0) {
    return (
      <div className="empty">
        <span>{t("content.empty", { ns: "courseCarousel" })}</span>
      </div>
    );
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
      infinite={false}
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
 * CourseCarouselItemProps
 */
interface CourseCarouselItemProps {
  course: SuggestedCourse;
  suggestedBySupervisor?: boolean;
}

/**
 * CourseCarouselItem
 * @param props props
 * @returns JSX.Element
 */
const CourseCarouselItem: React.FC<CourseCarouselItemProps> = (props) => {
  const { t } = useTranslation("courseCarousel");
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
            {t("actions.checkOut", { ns: "courseCarousel" })}
          </Button>

          <WorkspaceSignup
            workspaceSignUpDetails={{
              id: course.id,
              name: course.name,
              nameExtension: course.nameExtension,
              urlName: course.urlName,
            }}
            redirectOnSuccess
          >
            <Button
              aria-label={course.name}
              buttonModifiers={["studies-course-action"]}
            >
              {t("actions.signUp", { ns: "courseCarousel" })}
            </Button>
          </WorkspaceSignup>

          {course.description && (
            <WorkspaceDescriptionDialog course={course}>
              <Button
                aria-label={course.name}
                buttonModifiers={["studies-course-action"]}
              >
                {t("labels.description", { ns: "courseCarousel" })}
              </Button>
            </WorkspaceDescriptionDialog>
          )}
          {course.suggestedAsNext && (
            <span>
              {t("labels.guidanceCouncelorSuggestion", {
                ns: "courseCarousel",
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
