import * as React from "react";
import HopsPlanningTool from "../hops-planning-tool";
import FollowUpGoals from "../hops-follow-up-goals";
import { HopsBaseProps, HopsUser } from "..";
import { FollowUp, HopsStudyPeriodPlan } from "~/@types/shared";
import HopsPeriodPlan from "../hops-period-plan";

/**
 * StudiesPlanningProps
 */
interface HopsStudiesPlanningProps extends HopsBaseProps {
  user: HopsUser;
  followUp: FollowUp;
  studentId: string;
  studentsUserEntityId: number;
  studyTimeEnd: string | null;
  superVisorModifies: boolean;
  studyPeriodPlan?: HopsStudyPeriodPlan;
  onStudyPeriodPlanChange: (studyPeriodPlan: HopsStudyPeriodPlan) => void;

  /**
   * This is utility method to jump specific step. Doesn validate so use it carefully.
   * Weird things is that StepZilla library doesn't support types. So this is need to "activate"
   * this props, so it could work.
   */
  jumpToStep?: (step: number) => void;
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
  private myRef: HTMLDivElement = undefined;
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
   * componentDidMount
   */
  componentDidMount(): void {
    window.dispatchEvent(new Event("resize"));

    this.myRef.scrollIntoView({ behavior: "smooth" });
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: Readonly<HopsStudiesPlanningProps>): void {
    if (prevProps.disabled !== this.props.disabled) {
      this.props.jumpToStep(0);
    }
  }

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
      (this.props.phase && this.props.phase >= 2);

    return (
      <div className="hops-container" ref={(ref) => (this.myRef = ref)}>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Tavoitteet</legend>

          <FollowUpGoals
            disabled={this.props.disabled}
            studentId={this.props.studentId}
            studyTimeEnd={this.props.studyTimeEnd}
          />
        </fieldset>

        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Opintolaskuri</legend>
          {!hasAccessToStudyTool ? (
            <div className="hops-container__info">
              <div className="hops-container__not-available">
                Tämä osa lomakkeesta aktivoidaan ohjaajan toimesta.
              </div>
            </div>
          ) : (
            <div className="hops-container__info">
              <div className="hops__form-element-container">
                Opintoaikalaskuri vertaa valmistumiselle asettamaasi tavoitetta
                aikaan, joka sinulla on viikoittain käytössäsi opiskeluun. Yhden
                kurssin suorittaminen vie aikaa keskimäärin 28 tuntia. Jos
                valmistuminen ei ole mahdollista ajassa, jonka voit käyttää
                opiskelemiseen, kannattaa asiaa pohtia uudelleen.
              </div>
              <HopsPlanningTool
                user={this.props.user}
                usePlace={this.props.usePlace}
                studentId={this.props.studentId}
                studentsUserEntityId={this.props.studentsUserEntityId}
                disabled={this.props.disabled}
                studyTimeEnd={this.props.studyTimeEnd}
                superVisorModifies={this.props.superVisorModifies}
                showIndicators={true}
              />
            </div>
          )}
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Opiskelusuunnitelma
          </legend>
          <div className="hops-container__info">
            <div className="hops__form-element-container">
              Suunnittele opintosi seuraavalle 6 kuukauden jaksolle. Merkkaa
              kuukausittain suoritettavat kurssit (esim. ot1, bi1)
            </div>
            <HopsPeriodPlan
              disabled={this.props.disabled}
              studyPeriodPlan={this.props.studyPeriodPlan}
              onStudyPeriodPlanChange={this.props.onStudyPeriodPlanChange}
            />
          </div>
        </fieldset>
      </div>
    );
  }
}

export default HopsStudiesPlanning;
