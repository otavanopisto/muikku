import React, { useEffect, useRef } from "react";
import "~/sass/elements/hops.scss";
import { TextField } from "../../components/text-field";
import { Textarea } from "../../components/text-area";
import {
  CompulsoryStudiesHops,
  postGraduateStudies,
  vocationalStudySector,
  whatNext,
} from "~/@types/hops";
import { useTranslation } from "react-i18next";
import { useUseCaseContext } from "~/context/use-case-context";
import AnimateHeight from "react-animate-height";

/**
 * Props for the HopsPostGraduatePlan component
 */
interface HopsPostGraduatePlanProps {
  /** The current form state */
  form: CompulsoryStudiesHops;
  /** Callback function to update the form state */
  onFormChange: (form: CompulsoryStudiesHops) => void;
}

/**
 * HopsPostGraduatePlan Component
 *
 * This component renders a form for collecting information about a student's postgraduate study and career plan.
 *
 * @param props - The component props
 * @returns The rendered component
 */
const HopsPostGraduatePlan: React.FC<HopsPostGraduatePlanProps> = (props) => {
  const { form, onFormChange } = props;
  const myRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation("hops_new");

  const useCase = useUseCaseContext();
  const disabled = useCase === "GUARDIAN";

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
  const handleTextfieldChange =
    (name: keyof CompulsoryStudiesHops) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLocalForm({
        [name]: e.currentTarget.value,
      });
    };

  /**
   * Handles changes in textarea inputs
   * @param name - Key of CompulsoryStudiesHops
   * @returns Event handler function
   */
  const handleTextareaChange =
    (name: keyof CompulsoryStudiesHops) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onFormChange({
        ...form,
        [name]: e.currentTarget.value,
      });
    };

  // What next options
  const whatNextOptions = [
    { value: whatNext.postGraduateStudies, label: "Aion opiskella" },
    { value: whatNext.workingLife, label: "Aion mennä töihin" },
    { value: whatNext.dontKnow, label: "En tiedä" },
  ];

  // Postgraduate studies options
  const postGraduateStudiesOptions = [
    { value: "", label: "Valitse..." },
    {
      value: postGraduateStudies.vocationalSchool,
      label: "Ammatillinen toinen aste",
    },
    {
      value: postGraduateStudies.upperSecondarySchool,
      label: "Lukio",
    },
    { value: postGraduateStudies.else, label: "Joku muu" },
  ];

  // Vocational study sector options
  const vocationalStudySectorOptions = [
    {
      value: vocationalStudySector.socialHealthSector,
      label: "Sosiaali ja terveysala",
    },
    { value: vocationalStudySector.tradeSector, label: "Kauppa" },
    { value: vocationalStudySector.transportSector, label: "Liikenne" },
    { value: vocationalStudySector.educationSector, label: "Kasvatusala" },
    { value: vocationalStudySector.industrySector, label: "Teollisuus" },
    { value: vocationalStudySector.artSector, label: "Taide" },
    { value: vocationalStudySector.else, label: "Joku muu" },
  ];

  return (
    <div className="hops-container" ref={myRef}>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsCompulsoryEntryAssessmentTitle1", {
            ns: "hops_new",
          })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <label htmlFor="whatNext" className="hops__label">
              {t("labels.hopsCompulsoryWhatNext")}
            </label>
            <select
              id="followUpGoal"
              value={form.whatNext || ""}
              className="hops__select"
              disabled={disabled}
              onChange={handleSelectsChange("whatNext")}
            >
              <option value="">Valitse...</option>
              {whatNextOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <AnimateHeight
            height={form.whatNext === "POSTGRADUATE_STUDIES" ? "auto" : 0}
            contentClassName="hops-animate__height-wrapper"
            className="hops-container__row hops-container__row--dependant-of-above"
          >
            <div className="hops__form-element-container">
              <label htmlFor="whereApply" className="hops__label">
                {t("labels.hopsCompulsoryWhereApply", {
                  ns: "hops_new",
                })}
              </label>
              <select
                id="whereApply"
                value={form.postGraduateStudies || ""}
                className="hops__select"
                disabled={disabled}
                onChange={handleSelectsChange("postGraduateStudies")}
              >
                <option value="">Valitse...</option>
                {postGraduateStudiesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <AnimateHeight
              height={form.postGraduateStudies === "ELSE" ? "auto" : 0}
              contentClassName="hops-animate__height-wrapper"
              className="hops-container__row hops-container__row--dependant-of-above"
            >
              <div className="hops__form-element-container">
                <TextField
                  id="followUpStudiesElse"
                  label="Kerro tarkemmin"
                  defaultValue={form.postGraduateStudiesElse}
                  disabled={disabled}
                  onChange={handleTextfieldChange("postGraduateStudiesElse")}
                />
              </div>
            </AnimateHeight>
          </AnimateHeight>
          <AnimateHeight
            height={
              form.whatNext === "POSTGRADUATE_STUDIES" &&
              form.postGraduateStudies === "VOCATIONAL_SCHOOL"
                ? "auto"
                : 0
            }
            contentClassName="hops-animate__height-wrapper"
            className="hops-container__row hops-container__row--dependant-of-above"
          >
            <div className="hops__form-element-container">
              <label htmlFor="studySector" className="hops__label">
                {t("labels.hopsCompulsoryVocationalSector", {
                  ns: "hops_new",
                })}
              </label>
              <select
                id="studySector"
                value={form.vocationalPostGraduateStudySector || ""}
                className="hops__select"
                disabled={disabled}
                onChange={handleSelectsChange(
                  "vocationalPostGraduateStudySector"
                )}
              >
                <option value="">Valitse...</option>
                {vocationalStudySectorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <AnimateHeight
              height={
                form.vocationalPostGraduateStudySector === "SOMETHING_ELSE"
                  ? "auto"
                  : 0
              }
              contentClassName="hops-animate__height-wrapper"
              className="hops-container__row hops-container__row--dependant-of-above"
            >
              <div className="hops__form-element-container">
                <TextField
                  id="studySectorElse"
                  label="Kerro tarkemmin"
                  defaultValue={form.vocationalPostGraduateStudySectorElse}
                  disabled={disabled}
                  onChange={handleTextfieldChange(
                    "vocationalPostGraduateStudySectorElse"
                  )}
                />
              </div>
            </AnimateHeight>
          </AnimateHeight>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="followUpStudiesElse"
              label="Voit kertoa tarkemmin jatkosuunnitelmistasi"
              className="hops__textarea"
              defaultValue={form.futurePlans}
              disabled={disabled}
              onChange={handleTextareaChange("futurePlans")}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsPostGraduatePlan;
