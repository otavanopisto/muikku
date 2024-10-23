import React, { useEffect, useRef } from "react";
import { Education, LanguageGrade } from "~/@types/shared";
import "~/sass/elements/hops.scss";

import Button from "~/components/general/button";
import {
  HopsLanguageGradeTable,
  LanguageGradeRow,
} from "../../components/hops-language-grade-table";
import { TextField } from "~/components/general/hops-compulsory-education-wizard/text-field";
import {
  CompulsoryStudiesHops,
  HopsStartingLevelCompulsoryStudies,
} from "~/@types/hops";

/**
 * Props for the HopsStartingLevel component
 */
interface HopsStartingLevelProps {
  /** The current form state */
  form: CompulsoryStudiesHops;
  /** Callback function to update the form state */
  onFormChange: (form: CompulsoryStudiesHops) => void;
}

const disabled = false;

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
  const { form, onFormChange } = props;
  const { startingLevel } = form;
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

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
   * @param {keyof HopsStartingLevelCompulsoryStudies} name - The name of the field to update
   * @returns - Event handler function
   */
  const handleSelectsChange =
    (name: keyof HopsStartingLevelCompulsoryStudies) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      updateLocalForm({ [name]: e.currentTarget.value });
    };

  /**
   * Handles changes in text inputs
   * @param {keyof HopsStartingLevelCompulsoryStudies} name - The name of the field to update
   * @returns - Event handler function
   */
  const handleTextAreaChange =
    (name: keyof HopsStartingLevelCompulsoryStudies) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLocalForm({
        startingLevel: {
          ...startingLevel,
          [name]: e.currentTarget.value,
        },
      });
    };

  /**
   * Adds a new custom language to the language experience list
   */
  const handleAddNewCustomLngClick = () => {
    const updatedLngGrades = [
      ...startingLevel.previousLanguageExperience,
      { name: "", grade: undefined, hardCoded: false },
    ];
    updateLocalForm({
      startingLevel: {
        ...startingLevel,
        previousLanguageExperience: updatedLngGrades,
      },
    });
  };

  /**
   * Deletes a custom language from the language experience list
   * @param {number} index - The index of the language to delete
   */
  const handleDeleteCustomLngClick = (index: number) => {
    const updatedLngGrades = [...startingLevel.previousLanguageExperience];
    updatedLngGrades.splice(index, 1);
    updateLocalForm({
      startingLevel: {
        ...startingLevel,
        previousLanguageExperience: updatedLngGrades,
      },
    });
  };

  /**
   * Updates a custom language in the language experience list
   * @param {LanguageGrade} updatedLng - The updated language grade
   * @param {number} index - The index of the language to update
   */
  const handleCustomLngChange = (updatedLng: LanguageGrade, index: number) => {
    const updatedLngGrades = [...startingLevel.previousLanguageExperience];
    updatedLngGrades[index] = { ...updatedLng };
    updateLocalForm({
      startingLevel: {
        ...startingLevel,
        previousLanguageExperience: updatedLngGrades,
      },
    });
  };

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  return (
    <div className="hops-container" ref={myRef}>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          Aikaisemmat opinnot ja työkokemus
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="previousEducation" className="hops__label">
              Aiempi koulutus
            </label>
            <select
              id="previousEducation"
              className="hops__select"
              value={startingLevel.previousEducation}
              onChange={handleSelectsChange("previousEducation")}
              disabled={false}
            >
              <option value={Education.COMPULSORY_SCHOOL}>perusopetus</option>
              <option value={Education.VOCATIONAL_SCHOOL}>ammattiopisto</option>
              <option value={Education.NO_PREVIOUS_EDUCATION}>
                ei aiempaa koulutusta
              </option>
              <option value={Education.SOMETHING_ELSE}>joku muu</option>
            </select>
          </div>

          {startingLevel.previousEducation === Education.SOMETHING_ELSE ? (
            <div className="hops__form-element-container">
              <TextField
                id="previousEducationElse"
                label="Mikä?"
                className="hops__input"
                onChange={handleTextAreaChange("previousEducationElse")}
                value={startingLevel.previousEducationElse}
                disabled={disabled}
              />
            </div>
          ) : null}
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="previousYearsUsedInStudies"
              label="Opintoihin käytetyt vuodet?"
              className="hops__input"
              onChange={handleTextAreaChange("previousYearsUsedInStudies")}
              value={startingLevel.previousYearsUsedInStudies}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="previousWorkExperience" className="hops__label">
              Työkokemus:
            </label>
            <select
              id="previousWorkExperience"
              className="hops__select"
              value={startingLevel.previousWorkExperience}
              onChange={handleSelectsChange("previousWorkExperience")}
              disabled={disabled}
            >
              <option value="0-5">0-5 vuotta</option>
              <option value="6-10">6-10 vuotta</option>
              <option value="11-15">11-15 vuotta</option>
              <option value=">16">yli 16 vuotta</option>
            </select>
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="previousWorkExperienceField"
              label="Miltä alalta työkokemuksesi on?"
              className="hops__input"
              onChange={handleTextAreaChange("previousWorkExperienceField")}
              value={startingLevel.previousWorkExperienceField}
              disabled={disabled}
            />
          </div>
        </div>
      </fieldset>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader hops-container__subheader--required">
          Kielitaito
        </legend>

        <span>Tähdellä (*) merkityt kentät ovat pakollisia.</span>

        <div className="hops-container__row">
          <div className="hops-container__table-container">
            <HopsLanguageGradeTable usePlace={"studies"}>
              {startingLevel.previousLanguageExperience.map((lngG, index) => (
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
                  buttonModifiers={["add-hops-row"]}
                  onClick={handleAddNewCustomLngClick}
                  icon="plus"
                >
                  Lisää kieli
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
