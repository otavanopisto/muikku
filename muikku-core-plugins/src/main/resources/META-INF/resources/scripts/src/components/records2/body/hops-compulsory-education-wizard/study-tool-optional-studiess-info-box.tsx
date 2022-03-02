import * as React from "react";
import { NEEDED_STUDIES_IN_TOTAL } from ".";

/**
 * OptionalStudiesInfoBoxProps
 */
interface StudyToolOptionalStudiesInfoBoxProps {
  needMandatoryStudies: number;
  selectedNumberOfOptional: number;
  graduationGoal: string;
}

/**
 * OptionalStudiesInfoBox
 * @param props props
 * @returns JSX.Element
 */
const StudyToolOptionalStudiesInfoBox: React.FC<
  StudyToolOptionalStudiesInfoBoxProps
> = (props) => {
  const { needMandatoryStudies, selectedNumberOfOptional, graduationGoal } =
    props;

  if (
    selectedNumberOfOptional < NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies ||
    (selectedNumberOfOptional <
      NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies &&
      graduationGoal === "")
  ) {
    return (
      <div
        style={{
          border: "1px solid orange",
          borderLeftWidth: "2px",
          padding: "10px",
          fontStyle: "italic",
        }}
        className="hops__form-element-container"
      >
        <h3>
          Ei tarpeeksi valinnaiskursseja valittuna ({selectedNumberOfOptional}/
          {NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies})
        </h3>
        {graduationGoal === "" ? (
          <h3>Valmistumisaikatavoite valinta on tyhjä</h3>
        ) : null}
      </div>
    );
  } else if (
    selectedNumberOfOptional >
    NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies
  ) {
    return (
      <div
        style={{
          border: "1px solid lightblue",
          borderLeftWidth: "2px",
          padding: "10px",
          fontStyle: "italic",
        }}
        className="hops__form-element-container"
      >
        <h3>
          Sinulla on jo tarpeeksi valintoja, mutta voit suorittaa enemmänkin.
          Opiskeluaikaisi saattaa pidentyä
        </h3>
      </div>
    );
  } else {
    return null;
  }
};

export default StudyToolOptionalStudiesInfoBox;
