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
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--warning_notenough">
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

    case "warning_overstudyendtime":
      return (
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--warning_overstudyendtime">
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

    case "info_enough":
      return (
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--info_enough">
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

    case "info_toomuch":
      return (
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--info_toomuch">
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
      return (
        <div className="hops__form-element-container hops__form-element-container--info">
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
  }
};

export default StudyToolCalculationInfoBox;
