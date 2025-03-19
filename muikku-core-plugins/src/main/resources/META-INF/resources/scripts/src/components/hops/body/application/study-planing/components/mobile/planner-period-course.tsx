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
import AnimateHeight from "react-animate-height";
import WorkspaceSelect from "../workspace-select";
import { useTranslation } from "react-i18next";

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

  return (
    <BasePlannerPeriodCourse
      {...props}
      ref={drag}
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
                {t("labels.studyPlannerRemoveFromPlanDescription", {
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
      renderCourseState={({ isOpen, courseState }) => (
        <AnimateHeight
          duration={200}
          height={isOpen ? "auto" : 0}
          contentClassName="study-planner__extra-section study-planner__extra-section--specify"
        >
          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssi suunniteltu
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>

          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssille ilmoittauduttu
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>

          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssilta pyydetty arviointia
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>

          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssi arvioitu
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>

          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssin arvosana
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>
        </AnimateHeight>
      )}
    />
  );
};

export default MobilePlannerPeriodCourse;
