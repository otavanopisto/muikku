import React, { useEffect, useRef } from "react";
import "~/sass/elements/hops.scss";
import { TextField } from "../../components/text-field";
import { Textarea } from "../../components/text-area";
import { CompulsoryStudiesHops } from "~/@types/hops";
import { useTranslation } from "react-i18next";
import AnimateHeight from "react-animate-height";

/**
 * Props for the HopsPostGraduatePlan component
 */
interface HopsPostGraduatePlanProps {
  disabled: boolean;
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
  const { form, disabled, onFormChange } = props;
  const myRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation("hops_new");

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
  const whatNextOptions: {
    value: CompulsoryStudiesHops["whatNext"];
    label: string;
  }[] = [
    {
      value: "POSTGRADUATE_STUDIES",
      label: t("labels.hopsFormPostgraduateWhatNextOption2", {
        ns: "hops_new",
      }),
    },
    {
      value: "WORKING_LIFE",
      label: t("labels.hopsFormPostgraduateWhatNextOption1", {
        ns: "hops_new",
      }),
    },
    {
      value: "DONT_KNOW",
      label: t("labels.hopsFormPostgraduateWhatNextOption4", {
        ns: "hops_new",
      }),
    },
  ];

  // Postgraduate studies options
  const postGraduateStudiesOptions: {
    value: CompulsoryStudiesHops["postGraduateStudies"];
    label: string;
  }[] = [
    {
      value: "VOCATIONAL_SCHOOL",
      label: t("labels.hopsFormPostgraduateStudiesOption2", {
        ns: "hops_new",
      }),
    },
    {
      value: "UPPER_SECONDARY_SCHOOL",
      label: t("labels.hopsFormPostgraduateStudiesOption3", {
        ns: "hops_new",
      }),
    },
    {
      value: "ELSE",
      label: t("labels.hopsFormPostgraduateStudiesOption7", {
        ns: "hops_new",
      }),
    },
  ];

  // Vocational study sector options
  const vocationalStudySectorOptions: {
    value: CompulsoryStudiesHops["vocationalPostGraduateStudySector"];
    label: string;
  }[] = [
    {
      value: "SOCIAL_HEALT_SECTOR",
      label: t("labels.hopsFormStudySectorSocialAndHealth", {
        ns: "hops_new",
      }),
    },
    {
      value: "TRADE_SECTOR",
      label: t("labels.hopsFormStudySectorTrade", {
        ns: "hops_new",
      }),
    },
    {
      value: "TRANSPORT_SECTOR",
      label: t("labels.hopsFormStudySectorTransport", {
        ns: "hops_new",
      }),
    },
    {
      value: "EDUCATION_SECTOR",
      label: t("labels.hopsFormStudySectorEducation", {
        ns: "hops_new",
      }),
    },
    {
      value: "INDUSTRY_SECTOR",
      label: t("labels.hopsFormStudySectorIndustry", {
        ns: "hops_new",
      }),
    },
    {
      value: "ART_SECTOR",
      label: t("labels.hopsFormStudySectorArts", {
        ns: "hops_new",
      }),
    },
    {
      value: "SOMETHING_ELSE",
      label: t("labels.hopsFormStudySectorElse", {
        ns: "hops_new",
      }),
    },
  ];

  return (
    <div className="hops-container" ref={myRef}>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsCompulsoryPostgraduateSubTitle1", {
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
              <option value="">
                {t("labels.hopsSelect", { ns: "hops_new" })}
              </option>
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
                <option value="">
                  {t("labels.hopsSelect", { ns: "hops_new" })}
                </option>
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
                  label={t("labels.hopsTellMore", { ns: "hops_new" })}
                  value={form.postGraduateStudiesElse || ""}
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
                <option value="">
                  {t("labels.hopsSelect", { ns: "hops_new" })}
                </option>
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
                  label={t("labels.hopsTellMore", { ns: "hops_new" })}
                  value={form.vocationalPostGraduateStudySectorElse || ""}
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
              label={t("labels.hopsCompulsoryTellMoreFuturePlan", {
                ns: "hops_new",
              })}
              className="hops__textarea"
              value={form.futurePlans || ""}
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
