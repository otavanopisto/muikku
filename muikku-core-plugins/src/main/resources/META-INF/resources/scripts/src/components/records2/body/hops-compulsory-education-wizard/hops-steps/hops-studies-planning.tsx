import * as React from "react";
import StudyTool from "../study-tool";
import FollowUpGoals from "../hops-follow-up-goals";
import { HopsBaseProps, HopsUser } from "..";
import AlternativeStudyOptions from "../hops-alternative-study-options";
import { FollowUp, HopsPlanningStudies } from "~/@types/shared";

/**
 * StudiesPlanningProps
 */
interface HopsStudiesPlanningProps extends HopsBaseProps {
  user: HopsUser;
  finnishAsSecondLanguage: boolean;
  ethics: boolean;
  followUp: FollowUp;
  studies: HopsPlanningStudies;
  studentId: string;
  studyTimeEnd: string | null;
  superVisorModifies: boolean;
  onStudiesPlanningChange: (studies: HopsPlanningStudies) => void;
  onStudiesGoalsChange: (followUp: FollowUp) => void;
}

/**
 * StudiesPlanningState
 */
interface HopsStudiesPlanningState {
  openExtra: boolean;
  selectNextIsActive: boolean;
  selectSuggestedOptionalActive: boolean;
}

/**
 * StudiesPlanning
 */
class HopsStudiesPlanning extends React.Component<
  HopsStudiesPlanningProps,
  HopsStudiesPlanningState
> {
  /**
   * Constructor method
   *
   * @param props props
   */
  constructor(props: HopsStudiesPlanningProps) {
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
     * By default access is given to supervisor and for student
     * if student has access phase 3 or higher, then study tool is available
     */
    const hasAccessToStudyTool =
      this.props.user === "supervisor" ||
      (this.props.phase && this.props.phase >= 3);

    return (
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Tavoitteet</legend>

          <FollowUpGoals
            disabled={this.props.disabled}
            studentId={this.props.studentId}
            studyTimeEnd={this.props.studyTimeEnd}
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
            <>
              <div>
                Opintoaikalaskuri vertaa valmistumiselle asettamaasi tavoitetta
                aikaan, joka sinulla on viikoittain käytössäsi opiskeluun. Yhden
                kurssin suorittaminen vie aikaa keskimäärin 28 tuntia. Jos
                valmistuminen ei ole mahdollista ajassa, jonka voit käyttää
                opiskelemiseen, kannattaa asiaa pohtia uudelleen.
              </div>
              <StudyTool
                user={this.props.user}
                studentId={this.props.studentId}
                disabled={this.props.disabled}
                studies={this.props.studies}
                studyTimeEnd={this.props.studyTimeEnd}
                superVisorModifies={this.props.superVisorModifies}
                onStudiesPlanningChange={this.props.onStudiesPlanningChange}
              />
            </>
          )}
        </fieldset>
      </div>
    );
  }
}

export default HopsStudiesPlanning;
