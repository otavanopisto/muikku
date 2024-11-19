import React, { useEffect, useRef } from "react";
import "~/sass/elements/hops.scss";
import { SecondaryStudiesHops } from "~/@types/hops";
import { useTranslation } from "react-i18next";
import { useUseCaseContext } from "~/context/use-case-context";
import { Textarea } from "../../components/text-area";

/**
 * Props for the HopsStartingLevel component
 */
interface HopsPostGraduatePlanningProps {
  form: SecondaryStudiesHops;
  onFormChange: (form: SecondaryStudiesHops) => void;
}

/**
 * HopsPostGraduatePlan Component
 * @param props props
 *
 * This component renders a form for capturing the post-graduate plan information
 * for secondary studies, including previous education and language skills.
 */
const HopsPostGraduatePlanning: React.FC<HopsPostGraduatePlanningProps> = (
  props
) => {
  const { form, onFormChange } = props;
  const { t } = useTranslation(["hops_new"]);
  const myRef = useRef<HTMLDivElement>(null);

  const useCase = useUseCaseContext();
  const disabled = useCase === "GUARDIAN";

  /**
   * Effect to resize window and scroll into view on component mount
   */
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
    <div className="hops-container" ref={myRef}>
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
              label={t("labels.hopsSecondaryInterestedInFieldsOfStudy", {
                ns: "hops_new",
              })}
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
              label={t(
                "labels.hopsSecondaryPostGraduateGuidanceCouncelorComments",
                {
                  ns: "hops_new",
                }
              )}
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

export default HopsPostGraduatePlanning;
