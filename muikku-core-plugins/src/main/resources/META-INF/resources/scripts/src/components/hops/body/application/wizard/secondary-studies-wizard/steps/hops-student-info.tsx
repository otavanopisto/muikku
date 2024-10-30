import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import Button from "~/components/general/button";
import { TextField } from "~/components/general/hops-compulsory-education-wizard/text-field";
import HopsHistory from "../../history";
import { LoadMoreHopsFormHistoryTriggerType } from "~/actions/main-function/hops/";
import { useRef } from "react";
import { useEffect } from "react";

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

const loading = false;

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
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (loading) {
    return <div className="loader-empty" />;
  }

  return (
    <section className="hops-container" ref={myRef}>
      {/* Basic Information Fieldset */}
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Perustiedot</legend>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <TextField
              id="studentName"
              label="Nimi:"
              type="text"
              placeholder="Nimi"
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
              label="Koulutusaste:"
              type="text"
              placeholder="Koulutusaste"
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
              label="Ohjaaja:"
              type="text"
              placeholder="Ohjaaja"
              value={
                guidanceCounselors !== undefined &&
                guidanceCounselors.length > 0
                  ? guidanceCounselors.join(", ")
                  : "Ei ohjaaja"
              }
              disabled
              className="hops__input"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Muokkaushistoria</legend>
        <div className="hops-container__info">
          <HopsHistory />
          <div className="hops-container__row">
            <Button
              buttonModifiers={["load-all-hops-events"]}
              disabled={canLoadMoreHistory}
              onClick={() => loadMoreHopsEvents({})}
            >
              Lataa kaikki
            </Button>
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default HopsStudentHopsInformation;
