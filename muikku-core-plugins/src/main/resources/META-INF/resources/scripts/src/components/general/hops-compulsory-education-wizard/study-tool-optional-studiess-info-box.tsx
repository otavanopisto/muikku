import * as React from "react";

/**
 * OptionalStudiesInfoBoxProps
 */
interface StudyToolOptionalStudiesInfoBoxProps {
  totalOptionalStudiesNeeded: number;
  totalOptionalStudiesCompleted: number;
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
  const {
    totalOptionalStudiesCompleted,
    totalOptionalStudiesNeeded,
    selectedNumberOfOptional,
    graduationGoal,
  } = props;

  if (totalOptionalStudiesCompleted >= totalOptionalStudiesNeeded) {
    return (
      <div className="hops-container__info">
        <div className="hops-container__state state-SUCCESS">
          <div className="hops-container__state-icon icon-notification"></div>
          <div className="hops-container__state-text">
            Olet suorittanut tarvittavan vähittäismäärän (
            {totalOptionalStudiesNeeded}) valinnaisopintoja tutkintoosi.
            Halutessasi voit valita ja suorittaa lisää kursseja, silloin
            oppimäärän suorittamiseen kuluva aika saattaa tosin pidentyä.
          </div>
        </div>
      </div>
    );
  }

  if (
    selectedNumberOfOptional + totalOptionalStudiesCompleted ===
    totalOptionalStudiesNeeded
  ) {
    if (totalOptionalStudiesCompleted > 0) {
      return (
        <div className="hops-container__info">
          <div className="hops-container__state state-INFO">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              Jee! Olet suorittanut {totalOptionalStudiesCompleted}/
              {totalOptionalStudiesNeeded} valinnaiskursseja ja valinnut
              suoritettavaksi {selectedNumberOfOptional}/
              {totalOptionalStudiesNeeded}, mikä on riittävästi kursseja. Jos
              haluat, voit suorittaa valinnaisia opintoja enemmänkin. Silloin
              oppimäärän suorittamiseen kuluva aika saattaa tosin pidentyä.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="hops-container__info">
        <div className="hops-container__state state-INFO">
          <div className="hops-container__state-icon icon-notification"></div>
          <div className="hops-container__state-text">
            Jee! Olet valinnut itsellesi riittävän määrän valinnaisia opintoja (
            {selectedNumberOfOptional}/{totalOptionalStudiesNeeded}). Jos
            haluat, voit suorittaa valinnaisia opintoja enemmänkin. Silloin
            oppimäärän suorittamiseen kuluva aika saattaa tosin pidentyä.
          </div>
        </div>
      </div>
    );
  }

  if (
    selectedNumberOfOptional + totalOptionalStudiesCompleted >
    totalOptionalStudiesNeeded
  ) {
    if (totalOptionalStudiesCompleted > 0) {
      return (
        <div className="hops-container__info">
          <div className="hops-container__state state-INFO">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              Jee! Olet suorittanut {totalOptionalStudiesCompleted}/
              {totalOptionalStudiesNeeded} valinnaiskursseja ja valinnut
              suoritettavaksi {selectedNumberOfOptional}/
              {totalOptionalStudiesNeeded} kurssia. Tämä on enemmän kuin
              oppimääräsi velvoittaa. Jos haluat, voit suorittaa valinnaisia
              opintoja enemmänkin. Silloin oppimäärän suorittamiseen kuluva aika
              saattaa tosin pidentyä.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="hops-container__info">
        <div className="hops-container__state state-INFO">
          <div className="hops-container__state-icon icon-notification"></div>
          <div className="hops-container__state-text">
            Jee! Olet valinnut itsellesi riittävän määrän valinnaisia opintoja (
            {selectedNumberOfOptional}/{totalOptionalStudiesNeeded}). Jos
            haluat, voit suorittaa valinnaisia opintoja enemmänkin. Silloin
            oppimäärän suorittamiseen kuluva aika saattaa tosin pidentyä.
          </div>
        </div>
      </div>
    );
  }

  if (
    selectedNumberOfOptional + totalOptionalStudiesCompleted <
      totalOptionalStudiesNeeded ||
    (selectedNumberOfOptional + totalOptionalStudiesCompleted <
      totalOptionalStudiesNeeded &&
      graduationGoal === null)
  ) {
    if (totalOptionalStudiesCompleted > 0) {
      return (
        <div className="hops-container__info">
          <div className="hops-container__state state-WARNING">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              Olet suorittanut {totalOptionalStudiesCompleted}/
              {totalOptionalStudiesNeeded} valinnaiskursseja ja valinnut
              suoritettavaksi {selectedNumberOfOptional}/
              {totalOptionalStudiesNeeded} kurssia. Valitse vielä
              {` ${
                totalOptionalStudiesNeeded -
                selectedNumberOfOptional -
                totalOptionalStudiesCompleted
              } `}
              kurssia. Voit pyytää ohjaajaltasi apua kurssien valintaan.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="hops-container__info">
        <div className="hops-container__state state-WARNING">
          <div className="hops-container__state-icon icon-notification"></div>
          <div className="hops-container__state-text">
            Sinulla ei ole valittuna riittävästi valinnaisia opintoja. Valitse
            vielä
            {` ${
              totalOptionalStudiesNeeded -
              selectedNumberOfOptional -
              totalOptionalStudiesCompleted
            } `}
            kurssia osaksi suunnitelmaa. Voit pyytää ohjaajaltasi apua kurssien
            valintaan.
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default StudyToolOptionalStudiesInfoBox;
