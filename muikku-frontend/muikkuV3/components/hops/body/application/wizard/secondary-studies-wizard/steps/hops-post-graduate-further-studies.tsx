import * as React from "react";
import "~/sass/elements/hops.scss";
import { SecondaryStudiesHops } from "~/@types/hops";
import { useTranslation } from "react-i18next";
import { Textarea } from "../../components/text-area";

/**
 * Props for the HopsStartingLevel component
 */
interface HopsPostGraduateFurtherStudiesProps {
  disabled: boolean;
  form: SecondaryStudiesHops;
  onFormChange: (form: SecondaryStudiesHops) => void;
}

/**
 * HopsPostGraduateFurtherStudies Component
 * @param props props
 *
 * This component renders a form for capturing the post-graduate plan information
 * for secondary studies, including previous education and language skills.
 */
const HopsPostGraduateFurtherStudies: React.FC<
  HopsPostGraduateFurtherStudiesProps
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
          {t("labels.hopsSecondaryPostgraduateSubTitle5", { ns: "hops_new" })}
        </legend>

        <div className="hops-container__fieldset-description">
          {t("content.hopsSecondaryPostgraduateSubTitle5Content", {
            ns: "hops_new",
          })}
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="interestedInFieldsOfStudy"
              label={`${t("labels.hopsSecondaryInterestedInFieldsOfStudy", {
                ns: "hops_new",
              })}:`}
              className="hops__textarea"
              value={form.interestedInFieldsOfStudy}
              onChange={handleTextareaChange("interestedInFieldsOfStudy")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="whereCanStudyFieldsOfInterest"
              label={t("labels.hopsSecondaryWhereCanStudyFieldsOfInterest", {
                ns: "hops_new",
              })}
              className="hops__textarea"
              value={form.whereCanStudyFieldsOfInterest}
              onChange={handleTextareaChange("whereCanStudyFieldsOfInterest")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="basisForPostgraduateStudyAndCareerChoice"
              label={t(
                "labels.hopsSecondaryBasisForPostgraduateStudyAndCareerChoice",
                {
                  ns: "hops_new",
                }
              )}
              className="hops__textarea"
              value={form.basisForPostgraduateStudyAndCareerChoice}
              onChange={handleTextareaChange(
                "basisForPostgraduateStudyAndCareerChoice"
              )}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="thingsMakesYouThink"
              label={t("labels.hopsSecondaryThingsMakesYouThink", {
                ns: "hops_new",
              })}
              className="hops__textarea"
              value={form.thingsMakesYouThink}
              onChange={handleTextareaChange("thingsMakesYouThink")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="postGraduateGuidanceCouncelorComments"
              label={`${t(
                "labels.hopsSecondaryPostGraduateGuidanceCouncelorComments",
                {
                  ns: "hops_new",
                }
              )}:`}
              className="hops__textarea"
              value={form.postGraduateGuidanceCouncelorComments}
              onChange={handleTextareaChange(
                "postGraduateGuidanceCouncelorComments"
              )}
              disabled={disabled}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsPostGraduateFurtherStudies;
