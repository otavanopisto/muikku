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
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";

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

  const [isBeingEdited, setIsBeingEdited] = React.useState(false);

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
      canDrag: !disabled && !isBeingEdited,
    }),
    [disabled, isBeingEdited]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  // Use a callback ref that conditionally attaches the drag ref
  const dragRefCallback = React.useCallback(
    (node: HTMLDivElement | null) => {
      const canDrag = !disabled && !isBeingEdited;
      if (node && canDrag) {
        drag(node);
      } else if (!canDrag) {
        // Detach when dragging should be disabled
        drag(null);
      }
    },
    [disabled, isBeingEdited, drag]
  );

  /**
   * handleSpecifyCourse
   * @param callback callback
   */
  const handleSpecifyClose = (callback: () => void) => {
    unstable_batchedUpdates(() => {
      if (pendingSpecify) {
        callback();
        setPendingSpecify(false);
      }

      setIsBeingEdited(false);
    });
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
    unstable_batchedUpdates(() => {
      if (pendingDelete) {
        callback();
        setPendingDelete(false);
      }
      setIsBeingEdited(false);
    });
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
      ref={dragRefCallback}
      key={`draggable-card-${course.identifier}`}
      isDragging={isDragging}
      canDrag={!disabled && !isBeingEdited}
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
          onOpen={() => setIsBeingEdited(true)}
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
                {curriculumConfig.type === "compulsory"
                  ? t(
                      "labels.studyPlannerSpecifySelectCourseInstanceLabel_compulsory",
                      {
                        ns: "hops_new",
                      }
                    )
                  : t(
                      "labels.studyPlannerSpecifySelectCourseInstanceLabel_uppersecondary",
                      {
                        ns: "hops_new",
                      }
                    )}
              </label>

              <span className="study-planner__extra-section-group-label-info">
                {curriculumConfig.type === "compulsory"
                  ? t(
                      "labels.studyPlannerSpecifySelectCourseInstanceDescription_compulsory",
                      {
                        ns: "hops_new",
                      }
                    )
                  : t(
                      "labels.studyPlannerSpecifySelectCourseInstanceDescription_uppersecondary",
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
                curriculumType={curriculumConfig.type}
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
                {curriculumConfig.type === "compulsory"
                  ? t(
                      "labels.studyPlannerSpecifySelectDateDescription_compulsory",
                      {
                        ns: "hops_new",
                      }
                    )
                  : t(
                      "labels.studyPlannerSpecifySelectDateDescription_uppersecondary",
                      {
                        ns: "hops_new",
                      }
                    )}
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
          onOpen={() => setIsBeingEdited(true)}
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
                {t("labels.studyPlannerRemoveCourseFromPlanDescription", {
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
