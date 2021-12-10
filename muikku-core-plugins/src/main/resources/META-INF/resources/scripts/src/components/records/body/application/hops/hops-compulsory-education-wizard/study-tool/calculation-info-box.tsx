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
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--enough">
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
        <div className="hops__form-element-container hops__form-element-container--info hops__form-element-container--toomuch">
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
