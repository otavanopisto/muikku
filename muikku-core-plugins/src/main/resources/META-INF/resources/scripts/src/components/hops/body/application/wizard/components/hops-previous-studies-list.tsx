import React from "react";
import Button from "~/components/general/button";
import { Textarea } from "./text-area";
import { PreviousStudiesEntry } from "~/@types/hops";
import { useTranslation } from "react-i18next";

/**
 * Props for the HopsPreviousStudiesList component
 */
interface HopsPreviousStudiesListProps {
  /** Indicates if the component is disabled */
  disabled: boolean;
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
  const { disabled, onPreviousStudiesChange, previousStudies } = props;

  const { t } = useTranslation(["hops_new"]);

  /** Available study type options */
  const studyTypeOptions = [
    {
      value: "upper_secondary_education",
      label: t("labels.hopsSecondaryPreviousEducationStudyTypeOption1", {
        ns: "hops_new",
      }),
    },
    {
      value: "vocational_studies",
      label: t("labels.hopsSecondaryPreviousEducationStudyTypeOption2", {
        ns: "hops_new",
      }),
    },
    {
      value: "other_studies",
      label: t("labels.hopsSecondaryPreviousEducationStudyTypeOption3", {
        ns: "hops_new",
      }),
    },
  ];

  /** Available duration options */
  const durationOptions = [
    {
      value: "<1",
      label: t("labels.hopsSecondaryPreviousEducationStudyDurationOption1", {
        ns: "hops_new",
      }),
    },
    {
      value: "1-2",
      label: t("labels.hopsSecondaryPreviousEducationStudyDurationOption2", {
        ns: "hops_new",
      }),
    },
    {
      value: "2-3",
      label: t("labels.hopsSecondaryPreviousEducationStudyDurationOption3", {
        ns: "hops_new",
      }),
    },
    {
      value: "3-4",
      label: t("labels.hopsSecondaryPreviousEducationStudyDurationOption4", {
        ns: "hops_new",
      }),
    },
    {
      value: ">4",
      label: t("labels.hopsSecondaryPreviousEducationStudyDurationOption5", {
        ns: "hops_new",
      }),
    },
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
                disabled={disabled}
              >
                <option value="">
                  {t("labels.hopsSecondaryPreviousEducationStudyTypeOption0", {
                    ns: "hops_new",
                  })}
                </option>
                {studyTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                disabled={disabled}
              >
                <option value="">
                  {t(
                    "labels.hopsSecondaryPreviousEducationStudyDurationOption0",
                    { ns: "hops_new" }
                  )}
                </option>
                {durationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                    {t("labels.remove")}
                  </label>

                  <Button
                    onClick={() => deleteStudy(index)}
                    icon="trash"
                    buttonModifiers={"remove-extra-row"}
                    aria-labelledby="removeHopsRowPrevStudies"
                    disabled={disabled}
                  ></Button>
                </>
              )}
            </div>
          </div>
          {study.type !== "" && study.type !== "upper secondary education" && (
            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <Textarea
                  id={`moreInfo-${index}`}
                  className="hops__textarea"
                  value={study.moreInfo}
                  label={t("labels.hopsSecondaryPreviousEducationMoreInfo", {
                    ns: "hops_new",
                  })}
                  onChange={(e) =>
                    updateStudy(index, "moreInfo", e.target.value)
                  }
                  disabled={disabled}
                  placeholder={t(
                    "labels.hopsSecondaryPreviousEducationMoreInfoPlaceholder",
                    { ns: "hops_new" }
                  )}
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}

      <div className="hops-container__row">
        <Button
          buttonModifiers={["button-has-icon", "add-extra-row"]}
          icon="plus"
          onClick={addStudy}
          disabled={disabled}
        >
          {t("actions.addNewStudy", {
            ns: "hops_new",
          })}
        </Button>
      </div>
    </>
  );
};

export default PreviousStudies;
