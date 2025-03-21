import * as React from "react";
import { useDrag } from "react-dnd";
import BasePlannerPeriodCourse, {
  BasePlannerPeriodCourseProps,
} from "../planner-period-course-base";
import { getEmptyImage } from "react-dnd-html5-backend";
import Button from "~/components/general/button";
import DatePicker from "react-datepicker";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { AnimatedDrawer } from "../Animated-drawer";
import WorkspaceSelect from "../workspace-select";
import { useTranslation } from "react-i18next";
import { useActivePeriod } from "../../context/active-period-context";

/**
 * DesktopPlannerPeriodCourseProps
 */
interface DesktopPlannerPeriodCourseProps
  extends Omit<
    BasePlannerPeriodCourseProps,
    "renderSpecifyContent" | "renderDeleteWarning"
  > {}

/**
 * Desktop planner period course component
 * @param props props
 */
const DesktopPlannerPeriodCourse: React.FC<DesktopPlannerPeriodCourseProps> = (
  props
) => {
  const { course, disabled, curriculumConfig } = props;

  const { activePeriodStartDate } = useActivePeriod();

  const [pendingDelete, setPendingDelete] = React.useState(false);
  const [pendingSpecify, setPendingSpecify] = React.useState(false);

  const { t } = useTranslation(["hops_new", "common"]);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "planned-course-card",
      item: {
        info: course,
        type: "planned-course-card",
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      options: {
        dropEffect: "move",
      },
      canDrag: !disabled,
    }),
    [disabled]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  /**
   * handleSpecifyCourse
   * @param callback callback
   */
  const handleSpecifyClose = (callback: () => void) => {
    if (pendingSpecify) {
      callback();
      setPendingSpecify(false);
    }
  };

  /**
   * handleSpecifyCourse
   * @param callback callback
   */
  const handleSpecifyCourse = (callback: () => void) => {
    setPendingSpecify(true);
    callback();
  };

  /**
   * handleTransitionEnd
   * @param callback callback
   */
  const handleClose = (callback: () => void) => {
    if (pendingDelete) {
      callback();
      setPendingDelete(false);
    }
  };

  /**
   * handleDeleteCard
   * @param callback callback
   */
  const handleDeleteCard = (callback: () => void) => {
    setPendingDelete(true);
    callback();
  };

  return (
    <BasePlannerPeriodCourse
      {...props}
      ref={drag}
      // This is mandatory for the drag to notice the changes when disabled has changed
      key={`${course.identifier}-${disabled}`}
      isDragging={isDragging}
      renderSpecifyContent={({
        onClose,
        onConfirm,
        onChange,
        startDate,
        endDate,
        isOpen,
        workspaceInstance,
      }) => (
        <AnimatedDrawer
          isOpen={isOpen}
          contentClassName="study-planner__extra-section"
          onClose={() => handleSpecifyClose(onConfirm)}
        >
          <div className="study-planner__extra-section-title">
            {t("labels.studyPlannerSpecifyPlanTitle", {
              ns: "hops_new",
            })}
          </div>

          <div className="study-planner__extra-section-content">
            <div className="study-planner__extra-section-group">
              <label className="study-planner__extra-section-group-label">
                {t("labels.studyPlannerSpecifySelectCourseInstanceLabel", {
                  ns: "hops_new",
                })}
              </label>

              <span className="study-planner__extra-section-group-label-info">
                {t(
                  "labels.studyPlannerSpecifySelectCourseInstanceDescription",
                  {
                    ns: "hops_new",
                  }
                )}
              </span>
              <WorkspaceSelect
                selectedWorkspaceInstanceId={
                  workspaceInstance && workspaceInstance.id
                }
                onChange={(selectedWorkspace) => {
                  onChange(
                    startDate,
                    endDate,
                    selectedWorkspace && {
                      id: selectedWorkspace.value.id,
                      name: selectedWorkspace.value.name,
                      startDate: selectedWorkspace.value.startDate,
                      endDate: selectedWorkspace.value.endDate,
                      instanceExists: true,
                    }
                  );
                }}
                disabled={false}
                id="study-planner-specify-course"
                subjectCode={course.subjectCode}
                courseNumber={course.courseNumber}
                ops={
                  curriculumConfig.strategy.getCurriculumMatrix().curriculumName
                }
              />
            </div>

            <div className="study-planner__extra-section-group">
              <label className="study-planner__extra-section-group-label">
                {t("labels.studyPlannerSpecifySelectDateLabel", {
                  ns: "hops_new",
                })}
              </label>
              <span className="study-planner__extra-section-group-label-info">
                {t("labels.studyPlannerSpecifySelectDateDescription", {
                  ns: "hops_new",
                })}
              </span>
              <div className="study-planner__extra-section-date-inputs">
                <DatePicker
                  className="study-planner__input"
                  placeholderText={t("labels.startDate", {
                    ns: "hops_new",
                  })}
                  selected={startDate}
                  minDate={activePeriodStartDate}
                  onChange={(date) => onChange(date, endDate)}
                  locale={outputCorrectDatePickerLocale(localize.language)}
                  dateFormat="P"
                />
                <DatePicker
                  className="study-planner__input"
                  placeholderText={t("labels.endDate", {
                    ns: "hops_new",
                  })}
                  selected={endDate}
                  minDate={startDate}
                  onChange={(date) => onChange(startDate, date)}
                  locale={outputCorrectDatePickerLocale(localize.language)}
                  dateFormat="P"
                />
              </div>
            </div>

            <div className="study-planner__extra-section-group study-planner__extra-section-group--button-set">
              <Button
                buttonModifiers={["standard-ok", "execute"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpecifyCourse(onClose);
                }}
              >
                {t("actions.save", {
                  ns: "common",
                })}
              </Button>
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                {t("actions.cancel", {
                  ns: "common",
                })}
              </Button>
            </div>
          </div>
        </AnimatedDrawer>
      )}
      renderDeleteWarning={({ isOpen, onClose, onConfirm }) => (
        <AnimatedDrawer
          isOpen={isOpen}
          contentClassName="study-planner__extra-section"
          onClose={() => handleClose(onConfirm)}
        >
          <div className="study-planner__extra-section-title">
            {t("labels.studyPlannerRemoveFromPlanTitle", {
              ns: "hops_new",
            })}
          </div>
          <div className="study-planner__extra-section-content">
            <div className="study-planner__extra-section-group">
              <span className="study-planner__extra-section-group-label-info">
                {t("labels.studyPlannerRemoveFromPlanDescription", {
                  ns: "hops_new",
                })}
              </span>
            </div>

            <div className="study-planner__extra-section-group study-planner__extra-section-group--button-set">
              <Button
                buttonModifiers={["standard-ok", "fatal"]}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCard(onClose);
                }}
              >
                {t("actions.remove", {
                  ns: "common",
                })}
              </Button>
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                {t("actions.cancel", {
                  ns: "common",
                })}
              </Button>
            </div>
          </div>
        </AnimatedDrawer>
      )}
      // For later use, do not remove
      // renderCourseState={({ isOpen, onClose, courseState }) => (
      //   <AnimatedDrawer
      //     isOpen={isOpen}
      //     contentClassName="study-planner__extra-section study-planner__extra-section--specify"
      //   >
      //     <div className="study-planner__state-info-row">
      //       <span className="study-planner__state-info-row-label">
      //         Kurssi suunniteltu
      //       </span>
      //       <span className="study-planner__state-info-row-value">-</span>
      //     </div>

      //     <div className="study-planner__state-info-row">
      //       <span className="study-planner__state-info-row-label">
      //         Kurssille ilmoittauduttu
      //       </span>
      //       <span className="study-planner__state-info-row-value">-</span>
      //     </div>

      //     <div className="study-planner__state-info-row">
      //       <span className="study-planner__state-info-row-label">
      //         Kurssilta pyydetty arviointia
      //       </span>
      //       <span className="study-planner__state-info-row-value">-</span>
      //     </div>

      //     <div className="study-planner__state-info-row">
      //       <span className="study-planner__state-info-row-label">
      //         Kurssi arvioitu
      //       </span>
      //       <span className="study-planner__state-info-row-value">-</span>
      //     </div>

      //     <div className="study-planner__state-info-row">
      //       <span className="study-planner__state-info-row-label">
      //         Kurssin arvosana
      //       </span>
      //       <span className="study-planner__state-info-row-value">-</span>
      //     </div>
      //   </AnimatedDrawer>
      // )}
    />
  );
};

export default DesktopPlannerPeriodCourse;
