import * as React from "react";
import Dropdown from "../../../../../../general/dropdown";
import { ButtonPill } from "../../../../../../general/button";

type StudyState = "notenough" | "enough" | "toomuch";

interface CalculationInfoBoxProps {
  state: StudyState;
  message?: string;
}

/**
 * renderCalculationInfoBox
 * @param state
 * @returns JSX.Element
 */
const StudyCalculationInfoBox: React.FC<CalculationInfoBoxProps> = ({
  state,
  message,
}) => {
  switch (state) {
    case "notenough":
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
          <div>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {message && message}
              <Dropdown
                openByHover
                content={
                  <div>
                    Opintolaskuri kertoo myös ohjeistavan arvioin
                    valmistumistavoitteesi ja käytettävissä viikkotuntien
                    suhteesta.
                  </div>
                }
              >
                <div tabIndex={0} style={{ fontStyle: "normal" }}>
                  <ButtonPill>?</ButtonPill>
                </div>
              </Dropdown>
            </h3>
          </div>
        </div>
      );

    case "enough":
      return (
        <div
          style={{
            border: "2px solid lightblue",
            borderLeftWidth: "2px",
            padding: "10px",
            fontStyle: "italic",
          }}
          className="hops__form-element-container"
        >
          <div>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {message && message}{" "}
              <Dropdown
                openByHover
                content={
                  <div>
                    Opintolaskuri kertoo myös ohjeistavan arvioin
                    valmistumistavoitteesi ja käytettävissä viikkotuntien
                    suhteesta.
                  </div>
                }
              >
                <div tabIndex={0} style={{ fontStyle: "normal" }}>
                  <ButtonPill>?</ButtonPill>
                </div>
              </Dropdown>
            </h3>
          </div>
        </div>
      );

    case "toomuch":
      return (
        <div
          style={{
            border: "2px solid green",
            borderLeftWidth: "2px",
            padding: "10px",
            fontStyle: "italic",
          }}
          className="hops__form-element-container"
        >
          <div>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {message && message}{" "}
              <Dropdown
                openByHover
                content={
                  <div>
                    Opintolaskuri kertoo myös ohjeistavan arvioin
                    valmistumistavoitteesi ja käytettävissä viikkotuntien
                    suhteesta.
                  </div>
                }
              >
                <div tabIndex={0} style={{ fontStyle: "normal" }}>
                  <ButtonPill>?</ButtonPill>
                </div>
              </Dropdown>
            </h3>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default StudyCalculationInfoBox;
