import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { SaveState } from "~/@types/shared";
import { SavingDraftError } from "./saving-draft-error";
import { SavingDraftInfo } from "./saving-draft-info";

/**
 * MatriculationExaminationEnrollmentInfoProps
 */
interface MatriculationExaminationEnrollmentInfoProps {
  onChangeSystemChange?: (value: boolean) => void;
  usingOldSystem?: boolean;
  saveState?: SaveState;
  draftSaveErrorMsg?: string;
  endDate: string;
  compulsoryEducationEligible: boolean;
}

/**
 * MatriculationExaminationEnrollmentInfoState
 */
interface MatriculationExaminationEnrollmentInfoState {
  usingOldSystem: boolean;
}

/**
 * MatriculationExaminationEnrollmentInfo
 */
export class MatriculationExaminationEnrollmentInfo extends React.Component<
  MatriculationExaminationEnrollmentInfoProps,
  MatriculationExaminationEnrollmentInfoState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MatriculationExaminationEnrollmentInfoProps) {
    super(props);

    this.state = {
      usingOldSystem: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setState({ usingOldSystem: this.props.usingOldSystem });
  };

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate = (
    prevProps: MatriculationExaminationEnrollmentInfoProps
  ) => {
    if (this.props !== prevProps) {
      this.setState({
        usingOldSystem: this.props.usingOldSystem,
      });
    }
  };

  /**
   * handleCheckboxChange
   * @param e e
   */
  handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (this.props.onChangeSystemChange) {
      this.props.onChangeSystemChange(e.target.checked);
    }
  };

  /**
   * Render method
   * @returns JSX.Element
   */
  render() {
    const { saveState, draftSaveErrorMsg } = this.props;
    const { usingOldSystem } = this.state;

    return (
      <div className="matriculation-container">
        <SavingDraftError draftSaveErrorMsg={draftSaveErrorMsg} />
        <SavingDraftInfo saveState={saveState} />
        <h3 className="matriculation-container__header">
          Ylioppilaskirjoituksiin ilmoittautuminen
        </h3>
        <div className="matriculation-container__info">
          <p className="matriculation-container__info-item">
            Ilmoittautuminen ylioppilaskirjoituksiin on nyt auki. Voit
            ilmoittautua yo-kirjoituksiin, jos täytät abistatuksen. Lue lisää
            tiedotteesta.
          </p>
          <p className="matriculation-container__info-item">
            Täytä puuttuvat tiedot huolellisesti ja tarkista lomake ennen sen
            lähettämistä.
          </p>
          <div className="matriculation__form-element-container matriculation__form-element-container--single-row">
            <label className="matriculation__label">
              Suoritan tutkinnon vanhan tutkintorakenteen mukaisesti (tutkinnon
              suorittaminen alkanut syksyllä 2021 tai aiemmin)
            </label>
            <input
              onChange={this.handleCheckboxChange}
              checked={usingOldSystem}
              type="checkbox"
              className="matriculation__input"
            ></input>
          </div>

          {!this.state.usingOldSystem && (
            <>
              <h3 className="matriculation-container__subheader">
                Oppivelvollisuus
              </h3>
              {this.props.compulsoryEducationEligible ? (
                <p className="matriculation-container__info-item">
                  Olet laajennetun oppivelvollisuuden piirissä. Mikäli valittuja
                  kokeita on enemmän kuin viisi, valitse kokeista ne jotka
                  suoritat maksuttomana.
                </p>
              ) : (
                <p className="matriculation-container__info-item">
                  Et ole laajennetun oppivelvollisuuden piirissä.
                </p>
              )}
            </>
          )}

          <h3 className="matriculation-container__subheader">
            Ilmoittautuminen sulkeutuu <b>{this.props.endDate}</b>
          </h3>
          <p className="matriculation-container__info-item">
            Jos sinulla on kysyttävää, ota yhteyttä Riikka Turpeiseen
            (riikka.turpeinen@otavia.fi).
          </p>

          <div className="matriculation-container__state state-INFO">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>Ilmoittautuminen on sitova.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MatriculationExaminationEnrollmentInfo;
