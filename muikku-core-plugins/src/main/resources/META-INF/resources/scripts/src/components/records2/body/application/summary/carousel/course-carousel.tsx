import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import "react-multi-carousel/lib/styles.css";
import "~/sass/elements/carousel.scss";
import * as React from "react";
import Carousel from "react-multi-carousel";

import Button from "~/components/general/button";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { useCourseCarousel } from "./hooks/use-course-carousel";
import Link from "~/components/general/link";
import { SuggestionWithWorkspaceInfo } from "~/@types/shared";
import WorkspaceSignup from "~/components/coursepicker/dialogs/workspace-signup";
import { useCanSignUp } from "./hooks/use-can-signup";
import { useWorkspace } from "../../records/hooks/use-workspace";
import workspace from "~/components/guider/body/application/current-student/workspaces/workspace";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
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
 * @param props
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
export interface Course extends SuggestionWithWorkspaceInfo {}

/**
 * CourseCarouselItemProps
 */
interface CourseCarouselItemProps {
  course: Course;
}

/**
 * CourseCarouselItem
 * @param props
 * @returns JSX.Element
 */
const CourseCarouselItem: React.FC<CourseCarouselItemProps> = (props) => {
  const { course } = props;

  const { loadingCanSignUp, canSignUp, serverError } = useCanSignUp(course.id);
  const { loadingWorkspace, workspaceData, serverErrorWorkspace } =
    useWorkspace(course.id);

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  const createHtmlMarkup = (htmlString: string) => {
    return {
      __html: htmlString,
    };
  };

  const courseImage = course.hasCustomImage
    ? `url(/rest/workspace/workspaces/${course.workspaceId}/workspacefile/workspace-frontpage-image-cropped)`
    : "url(/gfx/workspace-default-header.jpg)";

  return (
    <div className="carousel-itemV2--courses">
      <div
        className="carousel-itemV2__image-section--courses"
        style={{ backgroundImage: courseImage }}
      >
        <h3>{course.name}</h3>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{ display: "flex", margin: "0 10px 0 0", padding: "2px 0" }}
        >
          <span
            style={{
              fontWeight: 300,
              textTransform: "uppercase",
            }}
          >
            Laajuus:
          </span>
          <span
            style={{
              textTransform: "uppercase",
              padding: "0 5px",
            }}
          >
            35 H
          </span>
        </div>
        <div
          style={{ display: "flex", margin: "0 10px 0 0", padding: "2px 0" }}
        >
          <span
            style={{
              fontWeight: 300,
              textTransform: "uppercase",
            }}
          >
            Tyyppi:
          </span>
          <span
            style={{
              textTransform: "uppercase",
              padding: "0 5px",
            }}
          >
            {course.courseType}
          </span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexFlow: "column",
          margin: "5px 0",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            textAlign: "initial",
            margin: "5px 0",
            height: "120px",
            maxHeight: "120px",
            overflow: "auto",
          }}
        >
          {course.description ? (
            <div
              dangerouslySetInnerHTML={createHtmlMarkup(course.description)}
            />
          ) : (
            <p style={{ margin: "5px" }}>-</p>
          )}
        </div>
        <div style={{ margin: "5px 0" }}>
          {loadingCanSignUp ? (
            <div className="loader-empty" />
          ) : (
            <>
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

              {canSignUp ? (
                <WorkspaceSignup>
                  <Button
                    aria-label={course.name}
                    buttonModifiers={[
                      "primary-function-content",
                      "coursepicker-course-action",
                    ]}
                  >
                    {/*  {this.props.i18n.text.get("plugin.coursepicker.course.signup")} */}
                    Ilmoittaudu
                  </Button>
                </WorkspaceSignup>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
