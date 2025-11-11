import * as React from "react";
// eslint-disable-next-line camelcase
import { localize } from "~/locales/i18n";
import { PlannerActivityItem } from "~/reducers/hops";
import {
  PlannerCard,
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "./planner-card";
import { useTranslation } from "react-i18next";
import { CurriculumConfig } from "~/util/curriculum-config";

/**
 * Base planner period course props
 */
export interface PlannerActivityCardProps {
  item: PlannerActivityItem;
  curriculumConfig: CurriculumConfig;
}

/**
 * Planner activity item component
 * @param props props
 */
const PlannerActivityCard = React.forwardRef<
  HTMLDivElement,
  PlannerActivityCardProps
>((props, ref) => {
  const { item, curriculumConfig } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * Gets course state
   * @returns course state
   */
  const getCourseState = () => {
    if (item.studyActivity) {
      switch (item.studyActivity.status) {
        case "GRADED":
          return item.studyActivity.passing
            ? {
                state: "completed",
                label: t("labels.completed", {
                  ns: "common",
                }),
              }
            : {
                state: "failed",
                label: t("labels.failed", {
                  ns: "common",
                }),
              };
        case "TRANSFERRED":
          return {
            state: "transferred",
            label: t("labels.transferredCredit", {
              ns: "common",
            }),
          };
        case "ONGOING":
          return {
            state: "inprogress",
            label: t("labels.inProgress", {
              ns: "common",
            }),
          };
        case "SUPPLEMENTATIONREQUEST":
          return {
            state: "supplementation-request",
            label: t("labels.incomplete", {
              ns: "common",
            }),
          };

        default:
          return { state: null, label: null };
      }
    }

    return { state: null, label: null };
  };

  const courseState = getCourseState();

  /**
   * Renders study activity date
   * @returns study activity date
   */
  const renderStudyActivityDate = () => {
    if (!item.studyActivity) {
      return null;
    }

    const date = localize.date(new Date(item.studyActivity.date));
    let dateString: string | null = null;

    switch (item.studyActivity.status) {
      case "GRADED":
        dateString = t("studyPlanCardActivity.graded", {
          ns: "hops_new",
          date,
        });
        break;

      case "ONGOING":
        dateString = t("studyPlanCardActivity.ongoing", {
          ns: "hops_new",
          date,
        });
        break;

      case "SUPPLEMENTATIONREQUEST":
        dateString = t("studyPlanCardActivity.supplementationRequest", {
          ns: "hops_new",
          date,
        });
        break;

      default:
        break;
    }

    if (!dateString) {
      return null;
    }

    return <div className="study-planner__course-dates-item">{dateString}</div>;
  };

  const cardModifiers = [];
  courseState.state && cardModifiers.push(courseState.state);

  const innerContainerModifiers = item.course.mandatory
    ? ["mandatory"]
    : ["optional"];

  const activityDate = renderStudyActivityDate();

  return (
    <PlannerCard
      ref={ref}
      modifiers={["planned", ...cardModifiers]}
      innerContainerModifiers={innerContainerModifiers}
    >
      <PlannerCardHeader modifiers={["planned-course-card"]}>
        <span className="study-planner__course-name">
          <b>{`${item.course.subjectCode}${item.course.courseNumber}`}</b>{" "}
          {`${item.course.name}, ${curriculumConfig.strategy.getCourseDisplayedLength(item.course)}`}
        </span>
      </PlannerCardHeader>

      <PlannerCardContent modifiers={["planned-course-card"]}>
        <div className="study-planner__course-labels">
          <PlannerCardLabel
            modifiers={[item.course.mandatory ? "mandatory" : "optional"]}
          >
            {item.course.mandatory
              ? t("labels.mandatory", {
                  ns: "common",
                })
              : t("labels.optional", {
                  ns: "common",
                })}
          </PlannerCardLabel>

          {courseState.state && (
            <PlannerCardLabel modifiers={["course-state", courseState.state]}>
              {courseState.label}
            </PlannerCardLabel>
          )}
        </div>

        {activityDate && (
          <div className="study-planner__course-dates">{activityDate}</div>
        )}
      </PlannerCardContent>
    </PlannerCard>
  );
});

PlannerActivityCard.displayName = "PlannerActivityCard";

export default PlannerActivityCard;
