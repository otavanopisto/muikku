import * as React from "react";
import StudyTool from "../study-tool/study-tool";
import FollowUpGoals from "../followUpGoal/follow-up-goals";
import { HopsBaseProps, HopsUser } from "../hops-compulsory-education-wizard";
import AlternativeStudyOptions from "../alternative-study-options/alternative-study-options";
import { FollowUp, HopsPlanningStudies } from "~/@types/shared";

/**
 * StudiesPlanningProps
 */
interface StudiesPlanningProps extends HopsBaseProps {
  user: HopsUser;
  finnishAsSecondLanguage: boolean;
  ethics: boolean;
  followUp: FollowUp;
  studies: HopsPlanningStudies;
  studentId: string;
  superVisorModifies: boolean;
  phaseList: number[];
  onStudiesPlanningChange: (studies: HopsPlanningStudies) => void;
  onStudiesGoalsChange: (followUp: FollowUp) => void;
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
   * Constructor method
   *
   * @param props props
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
   * Handles goals selects change
   *
   * @param name keyof HopsPlanningStudies
   */
  handleGoalsSelectsChange =
    (name: keyof HopsPlanningStudies) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.onStudiesPlanningChange({
        ...this.props.studies,
        [name]: e.currentTarget.value,
      });
    };

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  render() {
    /**
     * So if student has access "phase 2", student has access to study tool
     */
    const hasAccessToStudyTool = this.props.phaseList.includes(2);

    return (
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Tavoitteet</legend>

          <FollowUpGoals
            disabled={this.props.disabled}
            studentId={this.props.studentId}
          />
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Opintojen suunnittelu
          </legend>

          <AlternativeStudyOptions
            studentId={this.props.studentId}
            disabled={this.props.disabled}
          />
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Opintolaskuri</legend>
          {!hasAccessToStudyTool ? (
            <div className="hops__phase-info">
              Tämä osa lomakkeesta aktivoidaan ohjaajan toimesta.
            </div>
          ) : (
            <StudyTool
              user={this.props.user}
              studentId={this.props.studentId}
              disabled={this.props.disabled}
              studies={this.props.studies}
              superVisorModifies={this.props.superVisorModifies}
              onStudiesPlanningChange={this.props.onStudiesPlanningChange}
            />
          )}
        </fieldset>
      </div>
    );
  }
}

export default StudiesPlanning;
