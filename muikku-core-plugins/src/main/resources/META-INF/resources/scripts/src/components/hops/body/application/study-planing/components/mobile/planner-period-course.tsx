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
  const { course } = props;

  return (
    <BasePlannerPeriodCourse
      {...props}
      renderSpecifyContent={({
        onClose,
        onConfirm,
        onChange,
        startDate,
        endDate,
        isOpen,
      }) => (
        <Dialog
          isOpen={isOpen}
          onClose={onClose}
          title="Tarkenna suunnitelmaa"
          modifier="study-planner-specify-course"
          content={() => (
            <>
              <h4 className="study-planner__extra-section-title">
                Tarkenna suunnitelmaa
              </h4>

              <div className="study-planner__extra-section-content">
                <div className="study-planner__extra-section-input-group">
                  <label className="study-planner__extra-section-input-group-label">
                    Valitse kurssi-ilmentymä
                  </label>
                  <select className="study-planner__input">
                    <option>{course.name}</option>
                  </select>
                </div>

                <div className="study-planner__extra-section-input-group">
                  <label className="study-planner__extra-section-input-group-label">
                    Valitse ajankohta
                  </label>
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
              </div>
            </>
          )}
          footer={() => (
            <div className="study-planner__extra-section-button-group">
              <Button buttonModifiers={["secondary"]} onClick={onClose}>
                PERUUTA
              </Button>
              <Button buttonModifiers={["primary"]} onClick={onConfirm}>
                TARKENNA
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
          title="Vahvista poisto"
          content={(closePortal) => (
            <>
              <h4 className="study-planner__extra-section-title">
                Haluatko varmasti poistaa kurssin suunnitelmasta?
              </h4>
            </>
          )}
          footer={() => (
            <div className="study-planner__extra-section-button-group">
              <Button buttonModifiers={["secondary"]} onClick={onClose}>
                PERUUTA
              </Button>
              <Button buttonModifiers={["primary"]} onClick={onConfirm}>
                POISTA KURSSI
              </Button>
            </div>
          )}
        />
      )}
    />
  );
};

export default MobilePlannerPeriodCourse;
