import React from "react";
import Button from "~/components/general/button";
import { Textarea } from "./text-area";
import { PreviousStudiesEntry } from "~/@types/hops";

/**
 * Props for the HopsPreviousStudiesList component
 */
interface HopsPreviousStudiesListProps {
  /** Callback function to update the previous studies list */
  onPreviousStudiesChange: (previousStudies: PreviousStudiesEntry[]) => void;
  /** Array of previous studies entries */
  previousStudies: PreviousStudiesEntry[];
}

/**
 * PreviousStudies component
 * Renders a list of previous studies entries with options to add and update studies
 * @param {HopsPreviousStudiesListProps} props - The component props
 */
const PreviousStudies = (props: HopsPreviousStudiesListProps) => {
  const { onPreviousStudiesChange, previousStudies } = props;

  /** Available study type options */
  const studyTypeOptions = [
    "upper secondary education",
    "vocational studies",
    "other studies",
  ];

  /** Available duration options */
  const durationOptions = [
    "less than 1 year",
    "1–2 years",
    "2–3 years",
    "3–4 years",
    "more than 4 years",
  ];

  /**
   * Adds a new empty study entry to the list
   */
  const addStudy = () => {
    onPreviousStudiesChange([
      ...previousStudies,
      { type: "", duration: "", moreInfo: "" },
    ]);
  };

  /**
   * Updates a specific field of a study entry
   * @param {number} index - The index of the study entry to update
   * @param {string} field - The field to update (type, duration, or moreInfo)
   * @param {string} value - The new value for the field
   */
  const updateStudy = (index: number, field: string, value: string) => {
    const updatedStudies = previousStudies.map((study, i) =>
      i === index ? { ...study, [field]: value } : study
    );
    onPreviousStudiesChange(updatedStudies);
  };

  /**
   * Deletes a study entry from the list
   * @param {number} index - The index of the study entry to delete
   */
  const deleteStudy = (index: number) => {
    const updatedStudies = previousStudies.filter((_, i) => i !== index);
    onPreviousStudiesChange(updatedStudies);
  };

  return (
    <>
      {previousStudies.map((study, index) => (
        <React.Fragment key={index}>
          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label htmlFor={`studyType-${index}`} className="hops__label">
                Opintojen tyyppi
              </label>
              <select
                id={`studyType-${index}`}
                className="hops__select"
                value={study.type}
                onChange={(e) => updateStudy(index, "type", e.target.value)}
              >
                <option value="">Select Study Type</option>
                {studyTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="hops__form-element-container">
              <label htmlFor={`duration-${index}`} className="hops__label">
                Opintojen kesto
              </label>
              <select
                id={`duration-${index}`}
                className="hops__select"
                value={study.duration}
                onChange={(e) => updateStudy(index, "duration", e.target.value)}
              >
                <option value="">Select Duration</option>
                {durationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="hops__form-element-container hops__form-element-container--button">
              {!study.hardCoded && (
                <>
                  <label
                    id="removeHopsRowPrevStudies"
                    className="visually-hidden"
                  >
                    Poista
                  </label>

                  <Button
                    onClick={() => deleteStudy(index)}
                    icon="trash"
                    buttonModifiers={"remove-extra-row"}
                    aria-labelledby="removeHopsRowPrevStudies"
                  ></Button>
                </>
              )}
            </div>
          </div>
          {study.type !== "" && study.type !== "upper secondary education" && (
            <div className="hops-container__row">
              <Textarea
                id={`moreInfo-${index}`}
                className="form-element__textarea form-element__textarea--resize__vertically"
                value={study.moreInfo}
                label="Lisätietoja"
                onChange={(e) => updateStudy(index, "moreInfo", e.target.value)}
                placeholder="Tell us more"
              />
            </div>
          )}
        </React.Fragment>
      ))}

      <div className="hops-container__row">
        <Button
          buttonModifiers={["button-has-icon", "add-extra-row"]}
          icon="plus"
          onClick={addStudy}
        >
          Lisää uusi opinto
        </Button>
      </div>
    </>
  );
};

export default PreviousStudies;
