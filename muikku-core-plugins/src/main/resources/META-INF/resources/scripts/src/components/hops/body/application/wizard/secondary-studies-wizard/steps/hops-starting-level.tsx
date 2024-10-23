import React, { useEffect, useRef } from "react";
import "~/sass/elements/hops.scss";
import { TextField } from "~/components/general/hops-compulsory-education-wizard/text-field";
import PreviousStudies from "../../components/hops-previous-studies-list";
import { PreviousStudiesEntry, SecondaryStudiesHops } from "~/@types/hops";
import { Textarea } from "../../components/text-area";

/**
 * Props for the HopsStartingLevel component
 */
interface HopsStartingLevelProps {
  form: SecondaryStudiesHops;
  onFormChange: (form: SecondaryStudiesHops) => void;
}

// TODO: Consider making this a prop or state variable
const disabled = false;

/**
 * HopsStartingLevel Component
 * @param props props
 *
 * This component renders a form for capturing the starting level information
 * for secondary studies, including previous education and language skills.
 */
const HopsStartingLevel: React.FC<HopsStartingLevelProps> = (props) => {
  const { form, onFormChange } = props;
  const myRef = useRef<HTMLDivElement>(null);

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
   * Handles changes in the previous studies section
   * @param previousEducations - Updated array of previous education entries
   */
  const handlePreviousStudiesChange = (
    previousEducations: PreviousStudiesEntry[]
  ) => {
    updateLocalForm({ previousEducations });
  };

  /**
   * Handles changes in text fields
   * @param name - The name of the field to update
   * @returns - Event handler function
   */
  const handleTextFieldChange =
    (name: keyof SecondaryStudiesHops) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      updateLocalForm({ [name]: event.target.value });
    };

  /**
   * Handles changes in text areas
   * @param name - The name of the field to update
   * @returns - Event handler function
   */
  const handleTextAreaChange =
    (name: keyof SecondaryStudiesHops) =>
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateLocalForm({
        [name]: event.target.value,
      });
    };

  return (
    <div className="hops-container" ref={myRef}>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          Aikaisemmat opinnot
        </legend>

        <div className="hops-container__row">
          <PreviousStudies
            previousStudies={form.previousEducations}
            onPreviousStudiesChange={handlePreviousStudiesChange}
          />
        </div>
      </fieldset>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader hops-container__subheader--required">
          Kielitaito
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="nativeLanguage"
              label="Väestörekisteriin merkitty äidinkieli"
              className="hops__input"
              onChange={handleTextFieldChange("nativeLanguage")}
              value={form.nativeLanguage}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="studiedLanguagesAtSchool"
              label="Muut koulussa opiskellut kielet:"
              className="hops__input"
              onChange={handleTextFieldChange("studiedLanguagesAtSchool")}
              value={form.studiedLanguagesAtSchool}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="studiedLanguagesOther"
              label="Muu kielitaito (esim. ulkomailla hankittu osaaminen):"
              className="form-element__textarea form-element__textarea--resize__vertically"
              disabled={disabled}
              onChange={handleTextAreaChange("studiedLanguagesOther")}
              value={form.studiedLanguagesOther}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="additionalLanguageLearningInfo"
              label="Haluan kertoa kielenopiskeluvalmiuksistani myös:"
              className="form-element__textarea form-element__textarea--resize__vertically"
              disabled={disabled}
              onChange={handleTextAreaChange("languageLearningSkills")}
              value={form.languageLearningSkills}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsStartingLevel;
