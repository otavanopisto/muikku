import * as React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import moment from "moment";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { EvaluationAssessmentRequest } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import {
  updateInterimEvaluationRequestDeadline,
  updateAssessmentRequestDeadline,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form.scss";
import "~/sass/elements/react-datepicker-override.scss";

const PENDING_DEADLINE_DAYS = 14;
const INTERIM_DEADLINE_DAYS = 5;

/**
 * Returns the number of days to add to the request date to get the deadline date.
 * @param state EvaluationAssessmentRequest["state"]
 * @returns number
 */
const getDeadlineDayLimit = (state: EvaluationAssessmentRequest["state"]) =>
  state === "interim_evaluation_request"
    ? INTERIM_DEADLINE_DAYS
    : PENDING_DEADLINE_DAYS;

/**
 * Returns the minimum, maximum and default dates for the deadline.
 * @param request EvaluationAssessmentRequest
 */
const getDeadlineBounds = (request: EvaluationAssessmentRequest) => {
  const requestDate = request.assessmentRequestDate
    ? moment(request.assessmentRequestDate).startOf("day")
    : moment().startOf("day");
  const minDate = requestDate.toDate();
  const maxDate = requestDate
    .clone()
    .add(getDeadlineDayLimit(request.state), "days")
    .toDate();
  const defaultDate = request.deadline ?? maxDate;
  return { minDate, maxDate, defaultDate };
};

/**
 * Props for the EditDeadlineDateDialog component.
 */
interface EditDeadlineDateDialogProps {
  evaluationAssessmentRequest: EvaluationAssessmentRequest;
  children: React.ReactElement;
}

/**
 * Component for editing the deadline date of an evaluation assessment request.
 * @param props EditDeadlineDateDialogProps
 * @returns React.ReactElement
 */
const EditDeadlineDateDialog: React.FC<EditDeadlineDateDialogProps> = (
  props
) => {
  const { evaluationAssessmentRequest, children } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [locked, setLocked] = React.useState(false);

  const { minDate, maxDate, defaultDate } = getDeadlineBounds(
    evaluationAssessmentRequest
  );

  /**
   * Handles the opening of the dialog.
   */
  const handleOpen = () => {
    setSelectedDate(defaultDate);
  };

  /**
   * Handles the saving of the deadline date.
   * @param closeDialog () => void
   */
  const handleSave = (closeDialog: () => void) => {
    if (!selectedDate) return;
    setLocked(true);
    const data = {
      evaluationAssessmentRequest,
      deadline: selectedDate,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onSuccess: () => {
        setLocked(false);
        closeDialog();
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      onFail: () => setLocked(false),
    };
    if (evaluationAssessmentRequest.state === "interim_evaluation_request") {
      dispatch(updateInterimEvaluationRequestDeadline(data));
    } else {
      dispatch(updateAssessmentRequestDeadline(data));
    }
  };

  /**
   * Content for the EditDeadlineDateDialog component.
   * @returns React.ReactElement
   */
  const content = () => (
    <div className="form" role="form">
      <div className="form__row">
        <div className="form-element">
          <label htmlFor="evaluation-deadline">
            {t("labels.deadline", { ns: "evaluation" })}
          </label>
          <DatePicker
            id="evaluation-deadline"
            className="env-dialog__input"
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date)}
            minDate={minDate}
            maxDate={maxDate}
            locale={outputCorrectDatePickerLocale(localize.language)}
            dateFormat="P"
            clearButtonTitle=""
          />
        </div>
      </div>
    </div>
  );

  /**
   * Footer for the EditDeadlineDateDialog component.
   * @param closeDialog () => void
   * @returns React.ReactElement
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["execute", "standard-ok"]}
        onClick={() => handleSave(closeDialog)}
        disabled={locked || !selectedDate}
      >
        {t("actions.save")}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
        disabled={locked}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="evaluation-deadline"
      title={t("labels.editEvaluationDeadline", { ns: "evaluation" })}
      content={content}
      footer={footer}
      onOpen={handleOpen}
    >
      {children}
    </Dialog>
  );
};

export default EditDeadlineDateDialog;
