import * as React from "react";
import { HopsPlanningStudies } from "../../../../../../../@types/shared";
import StudyTool from "../study-tool/study-tool";
import FollowUpGoals from "../followUpGoal/follow-up-goals";

/**
 * StudiesPlanningProps
 */
interface StudiesPlanningProps {
  user: "supervisor" | "student";
  disabled: boolean;
  finnishAsSecondLanguage: boolean;
  ethics: boolean;
  studies: HopsPlanningStudies;
  studentId: string;
  superVisorModifies: boolean;
  onStudiesPlanningChange: (studies: HopsPlanningStudies) => void;
}

/**
 * StudiesPlanningState
 */
interface StudiesPlanningState {
  openExtra: boolean;
  selectNextIsActive: boolean;
  selectSuggestedOptionalActive: boolean;
}

/**
 * StudiesPlanning
 */
class StudiesPlanning extends React.Component<
  StudiesPlanningProps,
  StudiesPlanningState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: StudiesPlanningProps) {
    super(props);

    this.state = {
      openExtra: false,
      selectNextIsActive: false,
      selectSuggestedOptionalActive: false,
    };
  }

  /**
   * handleFinlandAsSecondLanguage
   * @param e
   */
  handleFinnishAsSecondLanguage = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      finnishAsSecondLanguage: e.target.checked,
    });
  };

  /**
   * handleEthicsChange
   */
  handleEthicsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onStudiesPlanningChange({
      ...this.props.studies,
      ethics: e.target.checked,
    });
  };

  /**
   * handleGoalsSelectsChange
   * @param name
   */
  handleGoalsSelectsChange =
    (name: keyof HopsPlanningStudies) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.onStudiesPlanningChange({
        ...this.props.studies,
        [name]: e.currentTarget.value,
      });
    };

  renderDemo2 = () => {
    const { graduationGoal } = this.props.studies;

    return (
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Tavoitteet</legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label className="hops-label">Valmistumisaikatavoite:</label>
              <select
                value={graduationGoal}
                onChange={this.handleGoalsSelectsChange("graduationGoal")}
                className="hops-select"
                disabled={this.props.disabled}
              >
                <option value="">Valitse...</option>
                <option value="6">6kk</option>
                <option value="12">1v.</option>
                <option value="18">1,5v.</option>
                <option value="24">2v.</option>
              </select>
            </div>
          </div>
          <FollowUpGoals disabled={this.props.disabled} />
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Opintojen suunnittelu
          </legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops-label">
                Suoritan äidinkielen sijaan Suomen toisena kielenä?
              </label>
              <input
                type="checkbox"
                className="hops-input"
                checked={this.props.finnishAsSecondLanguage}
                onChange={this.handleFinnishAsSecondLanguage}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <label className="hops-label">
                Suoritan uskonnon elämänkatsomustietona?
              </label>
              <input
                type="checkbox"
                className="hops-input"
                checked={this.props.ethics}
                onChange={this.handleEthicsChange}
                disabled={this.props.disabled}
              ></input>
            </div>
          </div>
        </fieldset>
        <StudyTool
          user={this.props.user}
          studentId={this.props.studentId}
          disabled={this.props.disabled}
          finnishAsSecondLanguage={this.props.finnishAsSecondLanguage}
          ethics={this.props.ethics}
          studies={this.props.studies}
          superVisorModifies={this.props.superVisorModifies}
        />
      </div>
    );
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return this.renderDemo2();
  }
}

export default StudiesPlanning;
