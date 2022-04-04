import * as React from "react";
import { ButtonPill } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";

/**
 * StudyState
 */
type StudyState = "notenough" | "enough" | "toomuch";

/**
 * CalculationInfoBoxProps
 */
interface StudyToolCalculationInfoBoxProps {
  state: StudyState;
  message?: string;
}

/**
 * StudyCalculationInfoBox
 * @param param0 param0
 * @param param0.state state
 * @param param0.message message
 * @returns JSX.Element
 */
const StudyToolCalculationInfoBox: React.FC<
  StudyToolCalculationInfoBoxProps
> = ({ state, message }) => {
  switch (state) {
    case "notenough":
      return (
        <div className="hops-container__info">
          <div className="hops-container__state state-WARNING">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              {message && message}
            </div>
          </div>
        </div>
      );

    case "enough":
      return (
        <div className="hops-container__info">
          <div className="hops-container__state state-SUCCESS">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              {message && message}
            </div>
          </div>
        </div>
      );

    case "toomuch":
      return (
        <div className="hops-container__info">
          <div className="hops-container__state state-INFO">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              {message && message}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default StudyToolCalculationInfoBox;
