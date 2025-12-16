import * as React from "react";
import "~/sass/elements/hops.scss";
import { SecondaryStudiesHops } from "~/@types/hops";
import { useTranslation } from "react-i18next";
import { Textarea } from "../../components/text-area";

/**
 * Props for the HopsStartingLevel component
 */
interface HopsPostGraduateStrengthsAndGoalsProps {
  disabled: boolean;
  form: SecondaryStudiesHops;
  onFormChange: (form: SecondaryStudiesHops) => void;
}

/**
 * HopsPostGraduateStrengthsAndGoals Component
 * @param props props
 *
 * This component renders a form for capturing the post-graduate plan information
 * for secondary studies, including previous education and language skills.
 */
const HopsPostGraduateStrengthsAndGoals: React.FC<
  HopsPostGraduateStrengthsAndGoalsProps
> = (props) => {
  const { form, disabled, onFormChange } = props;
  const { t } = useTranslation(["hops_new"]);

  /**
   * Updates the local form state and calls the parent's onChange handler
   * @param updates - Partial updates to the form
   */
  const updateLocalForm = (updates: Partial<SecondaryStudiesHops>) => {
    const updatedForm = { ...form, ...updates };
    onFormChange(updatedForm);
  };

  /**
   * Handles textarea change
   * @param field field
   * @returns void
   */
  const handleTextareaChange =
    (field: keyof SecondaryStudiesHops) =>
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateLocalForm({ [field]: event.target.value });
    };

  return (
    <div className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsSecondaryPostgraduateSubTitle3", { ns: "hops_new" })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="successfulDuringHighSchool"
              label={`${t("labels.hopsSecondarySuccesfullDuringHighSchool", {
                ns: "hops_new",
              })}:`}
              className="hops__textarea"
              value={form.successfulDuringHighSchool}
              onChange={handleTextareaChange("successfulDuringHighSchool")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="challengesDuringHighSchool"
              label={`${t("labels.hopsSecondaryChallangesDuringHighSchool", {
                ns: "hops_new",
              })}:`}
              className="hops__textarea"
              value={form.challengesDuringHighSchool}
              onChange={handleTextareaChange("challengesDuringHighSchool")}
              disabled={disabled}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsSecondaryPostgraduateSubTitle4", { ns: "hops_new" })}
        </legend>

        <div className="hops-container__fieldset-description">
          {t("content.hopsSecondaryPostgraduateSubTitle4Content", {
            ns: "hops_new",
          })}
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="interestedIn"
              label={`${t("labels.hopsSecondaryInterestedIn", { ns: "hops_new" })}:`}
              className="hops__textarea"
              value={form.interestedIn}
              onChange={handleTextareaChange("interestedIn")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="goodAt"
              label={`${t("labels.hopsSecondaryAmGood", { ns: "hops_new" })}:`}
              className="hops__textarea"
              value={form.goodAt}
              onChange={handleTextareaChange("goodAt")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="importantInFutureWork"
              label={`${t("labels.hopsSecondaryImportantInFutureWork", {
                ns: "hops_new",
              })}:`}
              className="hops__textarea"
              value={form.importantInFutureWork}
              onChange={handleTextareaChange("importantInFutureWork")}
              disabled={disabled}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsPostGraduateStrengthsAndGoals;
