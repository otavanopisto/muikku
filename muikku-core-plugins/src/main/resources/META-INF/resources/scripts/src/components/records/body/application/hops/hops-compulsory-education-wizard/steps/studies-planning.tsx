import * as React from "react";
import {
  HopsPlanningStudies,
  StudiesCourseData,
} from "../../../../../../../@types/shared";
import {
  FollowUpGoal,
  FollowUpStudies,
  StudySector,
} from "../../../../../../../@types/shared";
import StudyTool from "../study-tool/study-tool";

/**
 * StudiesPlanningProps
 */
interface StudiesPlanningProps extends StudiesCourseData {
  user: "supervisor" | "student";
  disabled: boolean;
  finnishAsSecondLanguage: boolean;
  ethics: boolean;
  studies: HopsPlanningStudies;
  studentId: string;
  onStudiesPlanningChange: (studies: HopsPlanningStudies) => void;
  onDeleteSelection?: () => void;
  onDeleteNextSelection?: () => void;
}

/**
 * StudiesPlanningState
 */
interface StudiesPlanningState {
  openExtra: boolean;
  selectNextIsActive: boolean;
  selectSuggestedOptionalActive: boolean;
  supervisorSuggestedNext: number[];
  supervisorSuggestedOptional: number[];
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
      supervisorSuggestedNext: [],
      supervisorSuggestedOptional: [],
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setState({
      supervisorSuggestedNext:
        this.props.studies.supervisorSuggestedNextListOfIds,
      supervisorSuggestedOptional:
        this.props.studies.supervisorSugestedSubjectListOfIds,
    });
  };

  /**
   * componentDidUpdate
   * @param nextProps
   * @param prevState
   */
  componentDidUpdate = (
    prevProps: StudiesPlanningProps,
    prevState: StudiesPlanningState
  ) => {
    if (
      JSON.stringify(prevProps.studies.supervisorSuggestedNextListOfIds) !==
      JSON.stringify(this.props.studies.supervisorSuggestedNextListOfIds)
    ) {
      this.setState({
        supervisorSuggestedNext:
          this.props.studies.supervisorSuggestedNextListOfIds,
      });
    }
    if (
      JSON.stringify(prevProps.studies.supervisorSugestedSubjectListOfIds) !==
      JSON.stringify(this.props.studies.supervisorSugestedSubjectListOfIds)
    ) {
      this.setState({
        supervisorSuggestedOptional:
          this.props.studies.supervisorSugestedSubjectListOfIds,
      });
    }
  };

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
    const { followUpGoal, graduationGoal, followUpStudies, studySector } =
      this.props.studies;

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

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label className="hops-label">Jatkotavoitteet:</label>
              <select
                value={followUpGoal}
                onChange={this.handleGoalsSelectsChange("followUpGoal")}
                className="hops-select"
                disabled={this.props.disabled}
              >
                <option value="">Valitse...</option>
                <option value={FollowUpGoal.POSTGRADUATE_STUDIES}>
                  Jatko-opinnot
                </option>
                <option value={FollowUpGoal.WORKING_LIFE}>Työelämä</option>
                <option value={FollowUpGoal.NO_FOLLOW_UP_GOALS}>
                  Ei muita tavotteita
                </option>
              </select>
            </div>
          </div>

          {followUpGoal === FollowUpGoal.POSTGRADUATE_STUDIES ? (
            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <label className="hops-label">Jatko-opinnot:</label>
                <select
                  value={followUpStudies}
                  onChange={this.handleGoalsSelectsChange("followUpStudies")}
                  className="hops-select"
                  disabled={this.props.disabled}
                >
                  <option value="">Valitse...</option>
                  <option value={FollowUpStudies.APPRENTICESHIP_TRAINING}>
                    Oppisopimuskoulutus
                  </option>
                  <option value={FollowUpStudies.VOCATIONAL_SCHOOL}>
                    Ammatillinen toinen aste
                  </option>
                  <option value={FollowUpStudies.UPPER_SECONDARY_SCHOOL}>
                    Lukio
                  </option>
                  <option value={FollowUpStudies.UNIVERSITY_STUDIES}>
                    Korkeakouluopinnot
                  </option>
                </select>
              </div>

              <div className="hops__form-element-container">
                <label className="hops-label">Koulutusala:</label>
                <select
                  value={studySector}
                  onChange={this.handleGoalsSelectsChange("studySector")}
                  className="hops-select"
                  disabled={this.props.disabled}
                >
                  <option value="">Valitse...</option>
                  <option value={StudySector.SOCIAL_HEALT_SECTOR}>
                    Sosiaali- ja terveysala
                  </option>
                  <option value={StudySector.TRADE_SECTOR}>Kauppa</option>
                  <option value={StudySector.TRANSPORT_SECTOR}>Liikenne</option>
                  <option value={StudySector.EDUCATION_SECTOR}>Kasvatus</option>
                  <option value={StudySector.INDUSTRY_SECTOR}>
                    Teollisuus
                  </option>
                  <option value={StudySector.ART_SECTOR}>Taide</option>
                </select>
              </div>
            </div>
          ) : null}
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
          approvedSubjectListOfIds={this.props.approvedSubjectListOfIds}
          completedSubjectListOfIds={this.props.completedSubjectListOfIds}
          inprogressSubjectListOfIds={this.props.inprogressSubjectListOfIds}
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
