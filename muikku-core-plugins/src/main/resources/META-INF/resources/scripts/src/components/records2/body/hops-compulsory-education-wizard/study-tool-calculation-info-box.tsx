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
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--notenough">
          <div>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {message && message}
            </h3>
          </div>
        </div>
      );

    case "enough":
      return (
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--enough">
          <div>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {message && message}
            </h3>
          </div>
        </div>
      );

    case "toomuch":
      return (
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--toomuch">
          <div>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {message && message}
            </h3>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default StudyToolCalculationInfoBox;
