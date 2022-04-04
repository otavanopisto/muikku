import * as React from "react";

/**
 * StudyState
 */
type StudyState =
  | "warning_notenough"
  | "warning_overstudyendtime"
  | "info_enough"
  | "info_toomuch";

/**
 * CalculationInfoBoxProps
 */
interface StudyToolCalculationInfoBoxProps {
  state?: StudyState;
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
    case "warning_notenough":
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

    case "warning_overstudyendtime":
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

    case "info_enough":
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

    case "info_toomuch":
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
  }
};

export default StudyToolCalculationInfoBox;
