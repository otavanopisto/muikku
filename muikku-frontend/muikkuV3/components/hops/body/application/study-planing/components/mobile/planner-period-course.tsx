import * as React from "react";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import BasePlannerPeriodCourse, {
  BasePlannerPeriodCourseProps,
} from "../planner-period-course-base";
import DatePicker from "react-datepicker";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import "~/sass/elements/form.scss";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import WorkspaceSelect from "../workspace-select";
import { useTranslation } from "react-i18next";
import { useActivePeriod } from "../../context/active-period-context";

/**
 * MobilePlannerPeriodCourseProps
 */
interface MobilePlannerPeriodCourseProps
  extends Omit<
    BasePlannerPeriodCourseProps,
    "isDragging" | "renderSpecifyContent" | "renderDeleteWarning"
  > {}

/**
 * Mobile planner period course component
 * @param props props
 */
const MobilePlannerPeriodCourse: React.FC<MobilePlannerPeriodCourseProps> = (
  props
) => {
  const { course, disabled, curriculumConfig } = props;

  const { activePeriodStartDate } = useActivePeriod();

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

  // Use a callback ref that conditionally attaches the drag ref
  const dragRefCallback = React.useCallback(
    (node: HTMLDivElement | null) => {
      const canDrag = !disabled;
      if (node && canDrag) {
        drag(node);
      } else if (!canDrag) {
        // Detach when dragging should be disabled
        drag(null);
      }
    },
    [disabled, drag]
  );

  return (
    <BasePlannerPeriodCourse
      {...props}
      ref={dragRefCallback}
      key={`draggable-card-${course.identifier}`}
      isDragging={isDragging}
      canDrag={!disabled}
      renderSpecifyContent={({
        onClose,
        onConfirm,
        onChange,
        startDate,
        endDate,
        isOpen,
        workspaceInstance,
      }) => (
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          title={t("labels.studyPlannerSpecifyPlanTitle", {
            ns: "hops_new",
          })}
          modifier="study-planner-specify-course"
          content={() => (
            <div className="study-planner__extra-section">
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
                      onChange(startDate, endDate, selectedWorkspace.value);
                    }}
                    disabled={false}
                    id="study-planner-specify-course"
                    subjectCode={course.subjectCode}
                    courseNumber={course.courseNumber}
                    ops={
                      curriculumConfig.strategy.getCurriculumMatrix()
                        .curriculumName
                    }
                    curriculumType={curriculumConfig.type}
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
                      minDate={activePeriodStartDate}
                      selected={startDate}
                      onChange={(date) => onChange(date, endDate)}
                      locale={outputCorrectDatePickerLocale(localize.language)}
                      dateFormat="P"
                    />
                    <DatePicker
                      className="study-planner__input"
                      placeholderText={t("labels.endDate", {
                        ns: "hops_new",
                      })}
                      minDate={startDate}
                      selected={endDate}
                      onChange={(date) => onChange(startDate, date)}
                      locale={outputCorrectDatePickerLocale(localize.language)}
                      dateFormat="P"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          footer={() => (
            <div className="dialog__button-set">
              <Button
                buttonModifiers={["standard-ok", "execute"]}
                onClick={onConfirm}
              >
                {t("actions.save", { ns: "common" })}
              </Button>
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={onClose}
              >
                {t("actions.cancel", { ns: "common" })}
              </Button>
            </div>
          )}
        />
      )}
      renderDeleteWarning={({ onClose, onConfirm, isOpen }) => (
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          modifier="study-planner-delete-course"
          title={t("labels.studyPlannerRemoveFromPlanTitle", {
            ns: "hops_new",
          })}
          content={(closePortal) => (
            <div>
              <span>
                {t("labels.studyPlannerRemoveCourseFromPlanDescription", {
                  ns: "hops_new",
                })}
              </span>
            </div>
          )}
          footer={() => (
            <div className="dialog__button-set">
              <Button
                buttonModifiers={["standard-ok", "fatal"]}
                onClick={onConfirm}
              >
                {t("actions.remove", { ns: "common" })}
              </Button>
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={onClose}
              >
                {t("actions.cancel", { ns: "common" })}
              </Button>
            </div>
          )}
        />
      )}
    />
  );
};

export default MobilePlannerPeriodCourse;
