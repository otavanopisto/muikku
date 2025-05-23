import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import Button from "~/components/general/button";
import { TextField } from "../../components/text-field";
import HopsHistory from "../../history";
import { LoadMoreHopsFormHistoryTriggerType } from "~/actions/main-function/hops/";
import { useTranslation } from "react-i18next";

/**
 * Props for the HopsStudentHopsInformation component
 * @interface HopsStudentHopsInformationProps
 */
interface HopsStudentHopsInformationProps {
  /** The name of the student */
  studentName: string;
  /** The educational level of the student */
  educationalLevel: string;
  /** An array of guidance counselor names */
  guidanceCounselors: string[];
  /** Indicates if there are more HOPS history entries to load */
  canLoadMoreHistory: boolean;
  /** The function to load more HOPS events */
  loadMoreHopsEvents: LoadMoreHopsFormHistoryTriggerType;
}

/**
 * HopsStudentHopsInformation component
 *
 * This component displays basic information about a student and their HOPS (Personal Study Plan) history.
 * It shows the student's name, educational level, guidance counselor(s), and a history of HOPS updates.
 *
 * @param {HopsStudentHopsInformationProps} props - The props for the component
 * @returns {React.ReactElement} The rendered component
 */
const HopsStudentHopsInformation: React.FC<HopsStudentHopsInformationProps> = (
  props
): React.ReactElement => {
  const {
    studentName,
    educationalLevel,
    guidanceCounselors,
    canLoadMoreHistory,
    loadMoreHopsEvents,
  } = props;

  const { t } = useTranslation("hops_new");

  return (
    <section className="hops-container">
      {/* Basic Information Fieldset */}
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsFormInfoTitle", { ns: "hops_new" })}
        </legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="studentName"
              label={t("labels.hopsFormBasicInfoName", { ns: "hops_new" })}
              type="text"
              value={studentName}
              disabled
              className="hops__input"
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="educationLevel"
              label={t("labels.hopsFormBasicInfoEducationLevel", {
                ns: "hops_new",
              })}
              type="text"
              value={educationalLevel}
              disabled
              className="hops__input"
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="guidanceCouselor"
              label={t("labels.hopsFormBasicInfoCouncelor", {
                ns: "hops_new",
              })}
              type="text"
              value={
                guidanceCounselors !== undefined &&
                guidanceCounselors.length > 0
                  ? guidanceCounselors.join(", ")
                  : t("labels.hopsFormBasicInfoCouncelor_no", {
                      ns: "hops_new",
                    })
              }
              disabled
              className="hops__input"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsFormHistory", { ns: "hops_new" })}
        </legend>
        <div className="hops-container__info">
          <HopsHistory />
          <div className="hops-container__row">
            <Button
              buttonModifiers={["load-all-hops-events"]}
              disabled={!canLoadMoreHistory}
              onClick={() => loadMoreHopsEvents({})}
            >
              {t("actions.load", { ns: "common", context: "all" })}
            </Button>
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default HopsStudentHopsInformation;
