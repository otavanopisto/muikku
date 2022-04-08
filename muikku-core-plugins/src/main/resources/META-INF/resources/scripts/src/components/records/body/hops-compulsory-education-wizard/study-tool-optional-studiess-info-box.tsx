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
      <div className="hops-container__info">
        <div className="hops-container__state state-WARNING">
          <div className="hops-container__state-icon icon-notification"></div>
          <div className="hops-container__state-text">
            Sinulla ei ole valittuna riittävästi valinnaisia opintoja (
            {selectedNumberOfOptional}/
            {NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies}). Valitse ainakin
            {` ${
              NEEDED_STUDIES_IN_TOTAL -
              needMandatoryStudies -
              selectedNumberOfOptional
            } `}
            kurssia.
          </div>
        </div>
      </div>
    );
  } else if (
    selectedNumberOfOptional >
    NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies
  ) {
    return (
      <div className="hops-container__info">
        <div className="hops-container__state state-INFO">
          <div className="hops-container__state-icon icon-notification"></div>
          <div className="hops-container__state-text">
            Jee! Olet valinnut itsellesi riittävän määrän valinnaisia opintoja (
            {selectedNumberOfOptional}/
            {NEEDED_STUDIES_IN_TOTAL - needMandatoryStudies}). Jos haluat, voit
            suorittaa valinnaisia opintoja enemmänkin. Silloin oppimäärän
            suorittamiseen kuluva aika saattaa tosin pidentyä.
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default StudyToolOptionalStudiesInfoBox;
