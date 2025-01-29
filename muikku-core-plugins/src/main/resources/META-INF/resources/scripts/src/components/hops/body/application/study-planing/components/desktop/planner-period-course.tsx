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
  const { course } = props;

  const [pendingDelete, setPendingDelete] = React.useState(false);

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
    }),
    []
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  /**
   * handleTransitionEnd
   * @param callback callback
   */
  const handleTransitionEnd = (callback: () => void) => {
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
    <div
      style={{
        position: "relative",
      }}
    >
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
        }) => (
          <AnimatedDrawer
            isOpen={isOpen}
            contentClassName="study-planner__extra-section study-planner__extra-section--specify"
          >
            <h4 className="study-planner__extra-section-title">
              Tarkenna suunnitelmaa
            </h4>

            <div className="study-planner__extra-section-content">
              <div className="study-planner__extra-section-input-group">
                <label className="study-planner__extra-section-input-group-label">
                  Valitse kurssi-ilmentymä
                </label>

                <span className="study-planner__extra-section-input-group-label-info">
                  Valitse kurssi-ilmentymä, jonka mukaan haluat suorituksen
                  toteuttaa
                </span>
                <select className="study-planner__input">
                  <option>{course.name}</option>
                </select>
              </div>

              <div className="study-planner__extra-section-input-group">
                <label className="study-planner__extra-section-input-group-label">
                  Valitse ajankohta
                </label>
                <span className="study-planner__extra-section-input-group-label-info">
                  Ajasta kurssi sinulle sopivaan ajankohtaan
                </span>
                <div className="study-planner__extra-section-date-inputs">
                  <DatePicker
                    className="study-planner__input"
                    placeholderText="Alkaa"
                    selected={startDate}
                    onChange={(date) => onChange(date, endDate)}
                    locale={outputCorrectDatePickerLocale(localize.language)}
                    dateFormat="P"
                  />
                  <DatePicker
                    className="study-planner__input"
                    placeholderText="Päättyy"
                    selected={endDate}
                    onChange={(date) => onChange(startDate, date)}
                    locale={outputCorrectDatePickerLocale(localize.language)}
                    dateFormat="P"
                  />
                </div>
              </div>

              <div className="study-planner__extra-section-button-group">
                <Button buttonModifiers={["secondary"]} onClick={onClose}>
                  PERUUTA
                </Button>
                <Button buttonModifiers={["primary"]} onClick={onConfirm}>
                  TARKENNA
                </Button>
              </div>
            </div>
          </AnimatedDrawer>
        )}
        renderDeleteWarning={({ isOpen, onClose, onConfirm }) => (
          <AnimatedDrawer
            isOpen={isOpen}
            contentClassName="study-planner__extra-section study-planner__extra-section--specify"
            onTransitionEnd={() => handleTransitionEnd(onConfirm)}
          >
            <h4 className="study-planner__extra-section-title">
              Haluatko varmasti poistaa kurssin suunnitelmasta?
            </h4>
            <div className="study-planner__extra-section-button-group">
              <Button buttonModifiers={["secondary"]} onClick={onClose}>
                PERUUTA
              </Button>
              <Button
                buttonModifiers={["primary"]}
                onClick={() => handleDeleteCard(onClose)}
              >
                POISTA KURSSI
              </Button>
            </div>
          </AnimatedDrawer>
        )}
        renderCourseState={({ isOpen, onClose, courseState }) => (
          <AnimatedDrawer
            isOpen={isOpen}
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
          </AnimatedDrawer>
        )}
      />
    </div>
  );
};

export default DesktopPlannerPeriodCourse;
