import * as React from "react";

interface OptionalStudiesInfoBoxProps {
  needMandatoryStudies: number;
  selectedNumberOfOptional: number;
  graduationGoal: string;
}

/**
 * renderCalculationInfoBox
 * @param state
 * @returns JSX.Element
 */
const OptionalStudiesInfoBox: React.FC<OptionalStudiesInfoBoxProps> = (
  props
) => {
  const { needMandatoryStudies, selectedNumberOfOptional, graduationGoal } =
    props;

  if (
    selectedNumberOfOptional < needMandatoryStudies ||
    (selectedNumberOfOptional < needMandatoryStudies && graduationGoal === "")
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
          {needMandatoryStudies})
        </h3>
        {graduationGoal === "" ? (
          <h3>Valmistumisaikatavoite valinta on tyhjä</h3>
        ) : null}
      </div>
    );
  } else if (selectedNumberOfOptional > needMandatoryStudies) {
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
  }
};

export default OptionalStudiesInfoBox;
