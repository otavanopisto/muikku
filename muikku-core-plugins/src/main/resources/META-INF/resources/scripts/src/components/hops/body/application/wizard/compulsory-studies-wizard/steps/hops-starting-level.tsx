import * as React from "react";
import { Education, LanguageGrade } from "~/@types/shared";
import "~/sass/elements/hops.scss";

import Button from "~/components/general/button";
import {
  HopsLanguageGradeTable,
  LanguageGradeRow,
} from "../../components/hops-language-grade-table";
import { TextField } from "../../components/text-field";
import { CompulsoryStudiesHops } from "~/@types/hops";
import { useTranslation } from "react-i18next";

/**
 * Props for the HopsStartingLevel component
 */
interface HopsStartingLevelProps {
  disabled: boolean;
  /** The current form state */
  form: CompulsoryStudiesHops;
  /** Callback function to update the form state */
  onFormChange: (form: CompulsoryStudiesHops) => void;
}

/**
 * HopsStartingLevel Component
 *
 * This component renders a form for collecting information about a student's starting level
 * for compulsory studies. It includes fields for previous education, work experience,
 * and language skills.
 *
 * @param props - The component props
 * @returns The rendered component
 */
const HopsStartingLevel: React.FC<HopsStartingLevelProps> = (props) => {
  const { form, disabled, onFormChange } = props;

  const { t } = useTranslation("hops_new");

  /**
   * Updates the local form state with the provided updates
   * @param {Partial<CompulsoryStudiesHops>} updates - Partial updates to apply to the form
   */
  const updateLocalForm = (updates: Partial<CompulsoryStudiesHops>) => {
    const updatedForm = { ...form, ...updates };
    onFormChange(updatedForm);
  };

  /**
   * Handles changes in select inputs
   * @param {keyof CompulsoryStudiesHops} name - The name of the field to update
   * @returns - Event handler function
   */
  const handleSelectsChange =
    (name: keyof CompulsoryStudiesHops) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateLocalForm({ [name]: e.currentTarget.value });
    };

  /**
   * Handles changes in text inputs
   * @param {keyof CompulsoryStudiesHops} name - The name of the field to update
   * @returns - Event handler function
   */
  const handleTextAreaChange =
    (name: keyof CompulsoryStudiesHops) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLocalForm({
        [name]: e.currentTarget.value,
      });
    };

  /**
   * Adds a new custom language to the language experience list
   */
  const handleAddNewCustomLngClick = () => {
    const updatedLngGrades = [
      ...form.previousLanguageExperience,
      { name: "", grade: undefined, hardCoded: false },
    ];
    updateLocalForm({
      previousLanguageExperience: updatedLngGrades,
    });
  };

  /**
   * Deletes a custom language from the language experience list
   * @param {number} index - The index of the language to delete
   */
  const handleDeleteCustomLngClick = (index: number) => {
    const updatedLngGrades = [...form.previousLanguageExperience];
    updatedLngGrades.splice(index, 1);
    updateLocalForm({
      previousLanguageExperience: updatedLngGrades,
    });
  };

  /**
   * Updates a custom language in the language experience list
   * @param {LanguageGrade} updatedLng - The updated language grade
   * @param {number} index - The index of the language to update
   */
  const handleCustomLngChange = (updatedLng: LanguageGrade, index: number) => {
    const updatedLngGrades = [...form.previousLanguageExperience];
    updatedLngGrades[index] = { ...updatedLng };
    updateLocalForm({
      previousLanguageExperience: updatedLngGrades,
    });
  };

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  return (
    <div className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsCompulsoryEntryAssessmentTitle1", {
            ns: "hops_new",
          })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="previousEducation" className="hops__label">
              {t("labels.hopsCompulsoryPreviousEducation", {
                ns: "hops_new",
              })}
            </label>
            <select
              id="previousEducation"
              className="hops__select"
              value={form.previousEducation}
              onChange={handleSelectsChange("previousEducation")}
              disabled={disabled}
            >
              <option value={Education.COMPULSORY_SCHOOL}>
                {t("labels.hopsCompulsoryPreviousEducationOption1", {
                  ns: "hops_new",
                })}
              </option>
              <option value={Education.VOCATIONAL_SCHOOL}>
                {t("labels.hopsCompulsoryPreviousEducationOption2", {
                  ns: "hops_new",
                })}
              </option>
              <option value={Education.NO_PREVIOUS_EDUCATION}>
                {t("labels.hopsCompulsoryPreviousEducationOption3", {
                  ns: "hops_new",
                })}
              </option>
              <option value={Education.SOMETHING_ELSE}>
                {t("labels.hopsCompulsoryPreviousEducationOption4", {
                  ns: "hops_new",
                })}
              </option>
            </select>
          </div>

          {form.previousEducation === Education.SOMETHING_ELSE ? (
            <div className="hops__form-element-container">
              <TextField
                id="previousEducationElse"
                label={t("labels.hopsCompulsoryPreviousEducationElse", {
                  ns: "hops_new",
                })}
                className="hops__input"
                onChange={handleTextAreaChange("previousEducationElse")}
                value={form.previousEducationElse || ""}
                disabled={disabled}
              />
            </div>
          ) : null}
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="previousYearsUsedInStudies"
              label={t("labels.hopsCompulsoryPreviousYearsUsedInStudies", {
                ns: "hops_new",
              })}
              className="hops__input"
              onChange={handleTextAreaChange("previousYearsUsedInStudies")}
              value={form.previousYearsUsedInStudies}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="previousWorkExperience" className="hops__label">
              {t("labels.hopsCompulsoryPreviousWorkExperience", {
                ns: "hops_new",
              })}
            </label>
            <select
              id="previousWorkExperience"
              className="hops__select"
              value={form.previousWorkExperience}
              onChange={handleSelectsChange("previousWorkExperience")}
              disabled={disabled}
            >
              <option value="0-5">
                {t("labels.hopsCompulsoryPreviousWorkExperienceOption1", {
                  ns: "hops_new",
                })}
              </option>
              <option value="6-10">
                {t("labels.hopsCompulsoryPreviousWorkExperienceOption2", {
                  ns: "hops_new",
                })}
              </option>
              <option value="11-15">
                {t("labels.hopsCompulsoryPreviousWorkExperienceOption3", {
                  ns: "hops_new",
                })}
              </option>
              <option value=">16">
                {t("labels.hopsCompulsoryPreviousWorkExperienceOption4", {
                  ns: "hops_new",
                })}
              </option>
            </select>
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="previousWorkExperienceField"
              label={t("labels.hopsCompulsoryPreviousWorkExperienceField", {
                ns: "hops_new",
              })}
              className="hops__input"
              onChange={handleTextAreaChange("previousWorkExperienceField")}
              value={form.previousWorkExperienceField}
              disabled={disabled}
            />
          </div>
        </div>
      </fieldset>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsCompulsoryEntryAssessmentTitle2", {
            ns: "hops_new",
          })}
        </legend>

        <span className="hops-container__fieldset-description">
          {t("labels.hopsFormFieldsRequired", {
            ns: "hops_new",
          })}
        </span>

        <div className="hops-container__row">
          <div className="hops-container__table-container">
            <HopsLanguageGradeTable usePlace={"studies"}>
              {form.previousLanguageExperience.map((lngG, index) => (
                <LanguageGradeRow
                  key={index}
                  index={index}
                  lng={lngG}
                  onLanguageRowChange={handleCustomLngChange}
                  onDeleteRowClick={handleDeleteCustomLngClick}
                  disabled={disabled}
                />
              ))}
            </HopsLanguageGradeTable>
            {!disabled ? (
              <div className="hops-container__row">
                <Button
                  buttonModifiers={["add-extra-row"]}
                  onClick={handleAddNewCustomLngClick}
                  icon="plus"
                >
                  {t("actions.addNewLng", {
                    ns: "hops_new",
                  })}
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsStartingLevel;
