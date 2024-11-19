import React, { useEffect, useRef } from "react";
import "~/sass/elements/hops.scss";
import {
  PostGraduateStudies,
  SecondaryStudiesHops,
  WhatNext,
} from "~/@types/hops";
import { useTranslation } from "react-i18next";
import { useUseCaseContext } from "~/context/use-case-context";
import { Textarea } from "../../components/text-area";
import AnimateHeight from "react-animate-height";

/**
 * Props for the HopsStartingLevel component
 */
interface HopsPostGraduatePlanProps {
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
const HopsPostGraduatePlan: React.FC<HopsPostGraduatePlanProps> = (props) => {
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
   * Handles what next checkbox change
   * @param event event
   */
  const handleWhatNextCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as WhatNext;

    const updatedForm = { ...form };

    // If the value is already in the array, remove it
    if (form.whatNext.includes(value)) {
      // If the value is "ELSE" is removed, clear the whatNextElse field
      if (value === "ELSE") {
        updatedForm.whatNextElse = "";
      }
      // If the value is "POSTGRADUATE_STUDIES" is removed, clear the postGraduateStudies field
      if (value === "POSTGRADUATE_STUDIES") {
        updatedForm.postGraduateStudies = [];
        updatedForm.postGraduateStudiesElse = "";
      }

      updatedForm.whatNext = form.whatNext.filter((v) => v !== value);

      updateLocalForm(updatedForm);
    } else {
      updatedForm.whatNext = [...form.whatNext, value];

      updateLocalForm(updatedForm);
    }
  };

  /**
   * Handles post-graduate studies checkbox change
   * @param event event
   */
  const handlePostGraduateStudiesCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as PostGraduateStudies;

    const updatedForm = { ...form };

    // If the value is already in the array, remove it
    if (form.postGraduateStudies.includes(value)) {
      // If the value is "ELSE" is removed, clear the postGraduateElse field
      if (value === "ELSE") {
        updatedForm.postGraduateStudiesElse = "";
      }

      updatedForm.postGraduateStudies = form.postGraduateStudies.filter(
        (v) => v !== value
      );

      updateLocalForm(updatedForm);
    } else {
      updatedForm.postGraduateStudies = [...form.postGraduateStudies, value];

      updateLocalForm(updatedForm);
    }
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

  // What next checkbox items
  const whatNextCheckboxItems: {
    id: string;
    value: SecondaryStudiesHops["whatNext"][number];
    label: string;
  }[] = [
    {
      id: "postgraduateStudies",
      value: "POSTGRADUATE_STUDIES",
      label: t("labels.hopsFormPostgraduateWhatNextOption2", {
        ns: "hops_new",
      }),
    },
    {
      id: "workingLife",
      value: "WORKING_LIFE",
      label: t("labels.hopsFormPostgraduateWhatNextOption1", {
        ns: "hops_new",
      }),
    },
    {
      id: "dontKnow",
      value: "DONT_KNOW",
      label: t("labels.hopsFormPostgraduateWhatNextOption4", {
        ns: "hops_new",
      }),
    },
    {
      id: "else",
      value: "ELSE",
      label: t("labels.hopsFormPostgraduateWhatNextOption3", {
        ns: "hops_new",
      }),
    },
  ];

  const postGraduateStudiesCheckboxItems: {
    id: string;
    value: SecondaryStudiesHops["postGraduateStudies"][number];
    label: string;
  }[] = [
    {
      id: "university",
      value: "UNIVERSITY",
      label: t("labels.hopsFormPostgraduateStudiesOption4", { ns: "hops_new" }),
    },
    {
      id: "vocationalInstitute",
      value: "UNIVERSITY_OF_APPLIED_SCIENCES",
      label: t("labels.hopsFormPostgraduateStudiesOption5", { ns: "hops_new" }),
    },
    {
      id: "vocationalSchool",
      value: "VOCATIONAL_SCHOOL",
      label: t("labels.hopsFormPostgraduateStudiesOption2", { ns: "hops_new" }),
    },
    {
      id: "else",
      value: "ELSE",
      label: t("labels.hopsFormPostgraduateStudiesOption7", { ns: "hops_new" }),
    },
  ];

  return (
    <div className="hops-container" ref={myRef}>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsSecondaryPostgraduateSubTitle1", { ns: "hops_new" })}
        </legend>

        {whatNextCheckboxItems.map((item) => (
          <div key={item.id} className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                id={item.id}
                type="checkbox"
                className="hops__input"
                value={item.value}
                checked={form.whatNext.includes(item.value)}
                onChange={handleWhatNextCheckboxChange}
                disabled={disabled}
              ></input>
              <label htmlFor={item.id} className="hops__label">
                {item.label}
              </label>
            </div>

            {item.value === "ELSE" && (
              <AnimateHeight
                height={form.whatNext.includes("ELSE") ? "auto" : 0}
                contentClassName="hops-animate__height-wrapper"
                className="hops-container__row hops-container__row--dependant-of-above"
              >
                <div className="hops-container__row">
                  <div className="hops__form-element-container">
                    <Textarea
                      id="whatNextElse"
                      label={t("labels.hopsSecondaryWhatNextElse", {
                        ns: "hops_new",
                      })}
                      className="hops__textarea"
                      value={form.whatNextElse}
                      onChange={handleTextareaChange("whatNextElse")}
                      disabled={disabled}
                    />
                  </div>
                </div>
              </AnimateHeight>
            )}

            {item.value === "POSTGRADUATE_STUDIES" && (
              <AnimateHeight
                height={
                  form.whatNext.includes("POSTGRADUATE_STUDIES") ? "auto" : 0
                }
                contentClassName="hops-animate__height-wrapper"
                className="hops-container__row hops-container__row--dependant-of-above"
              >
                {postGraduateStudiesCheckboxItems.map((item) => (
                  <>
                    <div key={item.id} className="hops-container__row">
                      <div className="hops__form-element-container hops__form-element-container--single-row">
                        <input
                          id={item.id}
                          type="checkbox"
                          className="hops__input"
                          value={item.value}
                          checked={form.postGraduateStudies.includes(
                            item.value
                          )}
                          onChange={handlePostGraduateStudiesCheckboxChange}
                          disabled={disabled}
                        ></input>
                        <label htmlFor={item.id} className="hops__label">
                          {item.label}
                        </label>
                      </div>
                    </div>

                    {item.value === "ELSE" && (
                      <AnimateHeight
                        height={
                          form.postGraduateStudies.includes("ELSE") ? "auto" : 0
                        }
                        contentClassName="hops-animate__height-wrapper"
                        className="hops-container__row hops-container__row--dependant-of-above"
                      >
                        <div key={item.id} className="hops-container__row">
                          <div className="hops__form-element-container">
                            <Textarea
                              id="postGraduateStudiesElse"
                              label={t(
                                "labels.hopsSecondaryPostGraduateStudiesElse",
                                {
                                  ns: "hops_new",
                                }
                              )}
                              className="hops__textarea"
                              value={form.postGraduateStudiesElse}
                              onChange={handleTextareaChange(
                                "postGraduateStudiesElse"
                              )}
                              disabled={disabled}
                            />
                          </div>
                        </div>
                      </AnimateHeight>
                    )}
                  </>
                ))}
              </AnimateHeight>
            )}
          </div>
        ))}
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsSecondaryPostgraduateSubTitle2", { ns: "hops_new" })}
        </legend>

        <div className="hops-container__fieldset-description">
          {t("content.hopsSecondaryPostgraduateSubTitle2Content", {
            ns: "hops_new",
          })}
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="workExperience"
              label={t("labels.hopsSecondaryWorkExperienceAndIntership", {
                ns: "hops_new",
              })}
              className="hops__textarea"
              value={form.workExperienceAndInternships}
              onChange={handleTextareaChange("workExperienceAndInternships")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="hobbies"
              label={t("labels.hopsSecondaryHobbies", { ns: "hops_new" })}
              className="hops__textarea"
              value={form.hobbies}
              onChange={handleTextareaChange("hobbies")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="otherSkills"
              label={t("labels.hopsSecondaryOtherSkills", { ns: "hops_new" })}
              className="hops__textarea"
              value={form.otherSkills}
              onChange={handleTextareaChange("otherSkills")}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="skillsFromHobbiesAndWorklife"
              label={t("labels.hopsSecondarySkillsFromHobbiesAndWorklife", {
                ns: "hops_new",
              })}
              className="hops__textarea"
              value={form.skillsFromHobbiesAndWorklife}
              onChange={handleTextareaChange("skillsFromHobbiesAndWorklife")}
              disabled={disabled}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsSecondaryPostgraduateSubTitle3", { ns: "hops_new" })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="successfulDuringHighSchool"
              label={t("labels.hopsSecondarySuccesfullDuringHighSchool", {
                ns: "hops_new",
              })}
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
              label={t("labels.hopsSecondaryChallangesDuringHighSchool", {
                ns: "hops_new",
              })}
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
              label={t("labels.hopsSecondaryInterestedIn", { ns: "hops_new" })}
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
              label={t("labels.hopsSecondaryAmGood", { ns: "hops_new" })}
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
              label={t("labels.hopsSecondaryImportantInFutureWork", {
                ns: "hops_new",
              })}
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

export default HopsPostGraduatePlan;
