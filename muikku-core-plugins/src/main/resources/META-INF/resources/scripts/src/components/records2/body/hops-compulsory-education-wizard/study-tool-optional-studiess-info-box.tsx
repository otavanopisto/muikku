import * as React from "react";
import { NEEDED_STUDIES_IN_TOTAL } from ".";

/**
 * OptionalStudiesInfoBoxProps
 */
interface StudyToolOptionalStudiesInfoBoxProps {
  needMandatoryStudies: number;
  selectedNumberOfOptional: number;
  graduationGoal: Date | null;
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
      graduationGoal === null)
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
          Sinulla ei ole valittuna riittävästi valinnaisia opintoja (
          {selectedNumberOfOptional}/
          {NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies}). Valitse ainakin x
          kurssia.
        </h3>
        {graduationGoal === null ? (
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
          Jee! Olet valinnut itsellesi riittävän määrän valinnaisia opintoja
          (x/9). Jos haluat, voit suorittaa valinnaisia opintoja enemmänkin.
          Silloin oppimäärän suorittamiseen kuluva aika saattaa tosin pidentyä.
        </h3>
      </div>
    );
  } else {
    return null;
  }
};

export default StudyToolOptionalStudiesInfoBox;
