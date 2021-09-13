import * as React from "react";
import { Textarea } from "../text-area";
import { CheckboxGroup, CheckboxGroupItem } from "../checkbox-group";
import {
  HopsMotivationAndStudy,
  FollowUpGoal,
  FollowUpStudies,
  StudySector,
} from "../../../../../../../@types/shared";
import AnimateHeight from "react-animate-height";
import { isUndefined } from "util";

interface MotivationAndStudySkillsProps {
  disabled: boolean;
  onMotivationAndStudyChange: (
    motivationAndStudy: HopsMotivationAndStudy
  ) => void;
  motivationAndStudy: HopsMotivationAndStudy;
}

interface MotivationAndStudySkillsState {
  someOtherWay: boolean;
  someOtherMethod: boolean;
  somethingElse: boolean;
}

class MotivationAndStudySkills extends React.Component<
  MotivationAndStudySkillsProps,
  MotivationAndStudySkillsState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: MotivationAndStudySkillsProps) {
    super(props);

    this.state = {
      someOtherWay: false,
      someOtherMethod: false,
      somethingElse: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setState({
      someOtherWay: this.props.motivationAndStudy.someOtherWay !== undefined,
      someOtherMethod:
        this.props.motivationAndStudy.someOtherMethod !== undefined,
      somethingElse: this.props.motivationAndStudy.somethingElse !== undefined,
    });
  };

  /**
   * handleTextareaChange
   * @param name
   */
  handleTextareaChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: e.currentTarget.value,
      });
    };

  /**
   * handleCheckboxElseChanges
   * @param name
   */
  handleCheckboxElseChanges =
    (name: keyof MotivationAndStudySkillsState) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        ...this.state,
        [name]: e.target.checked,
      });
    };

  /**
   * handleCheckboxItemChange
   * @param name
   */
  handleCheckboxItemChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: e.target.checked,
      });
    };

  /**
   * handleGoalsSelectsChange
   * @param name
   */
  handleGoalsSelectsChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: e.currentTarget.value,
      });
    };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const {
      byReading,
      byListening,
      byDoing,
      someOtherWay,
      byMemorizing,
      byTakingNotes,
      byDrawing,
      byListeningTeacher,
      byWatchingVideos,
      byFollowingOthers,
      someOtherMethod,
      noSupport,
      family,
      friend,
      supportPerson,
      teacher,
      somethingElse,
      hardOrEasyInStudies,
      strengthsOrWeaknesses,
      interests,
      areasToAdvance,
      graduationGoal,
      followUpGoal,
      followUpStudies,
      studySector,
    } = this.props.motivationAndStudy;

    return (
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Miten opin?</legend>

          <div className="hops-container__row hops-container__row--list">
            <CheckboxGroup>
              <CheckboxGroupItem
                label="Lukemalla"
                className="group__item"
                checked={byReading}
                onChange={this.handleCheckboxItemChange("byReading")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Kuuntelemalla"
                className="group__item"
                checked={byListening}
                onChange={this.handleCheckboxItemChange("byListening")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Tekemällä"
                className="group__item"
                checked={byDoing}
                onChange={this.handleCheckboxItemChange("byDoing")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Muu? Mikä?"
                className="group__item"
                checked={this.state.someOtherWay}
                onChange={this.handleCheckboxElseChanges("someOtherWay")}
                disabled={this.props.disabled}
              />
            </CheckboxGroup>
          </div>
          <AnimateHeight height={this.state.someOtherWay ? "auto" : 0}>
            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <Textarea
                  className="form-element__textarea form-element__textarea--resize__vertically"
                  label="Muu?"
                  value={someOtherWay}
                  onChange={this.handleTextareaChange("someOtherWay")}
                  disabled={this.props.disabled}
                />
              </div>
            </div>
          </AnimateHeight>
        </fieldset>

        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Millaisia tapoja olen aiemmin käyttänyt?
          </legend>

          <div className="hops-container__row hops-container__row--list">
            <CheckboxGroup>
              <CheckboxGroupItem
                label="Opettelen asioita ulkoa"
                className="group__item"
                checked={byMemorizing}
                onChange={this.handleCheckboxItemChange("byMemorizing")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Kirjoitan muistiinpanoja"
                className="group__item"
                checked={byTakingNotes}
                onChange={this.handleCheckboxItemChange("byTakingNotes")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Piirrän kuvioita"
                className="group__item"
                checked={byDrawing}
                onChange={this.handleCheckboxItemChange("byDrawing")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Kuuntelen opettaja"
                className="group__item"
                checked={byListeningTeacher}
                onChange={this.handleCheckboxItemChange("byListeningTeacher")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Katson videoita"
                className="group__item"
                checked={byWatchingVideos}
                onChange={this.handleCheckboxItemChange("byWatchingVideos")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Seuraan toisen tekemistä"
                className="group__item"
                checked={byFollowingOthers}
                onChange={this.handleCheckboxItemChange("byFollowingOthers")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Muu? Mikä?"
                className="group__item"
                checked={this.state.someOtherMethod}
                onChange={this.handleCheckboxElseChanges("someOtherMethod")}
                disabled={this.props.disabled}
              />
            </CheckboxGroup>
          </div>
          <AnimateHeight height={this.state.someOtherMethod ? "auto" : 0}>
            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <Textarea
                  className="form-element__textarea form-element__textarea--resize__vertically"
                  label="Muu?"
                  value={someOtherMethod}
                  onChange={this.handleTextareaChange("someOtherMethod")}
                  disabled={this.props.disabled}
                />
              </div>
            </div>
          </AnimateHeight>
        </fieldset>

        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Keneltä saan tukea opiskeluun?
          </legend>

          <div className="hops-container__row hops-container__row--list">
            <CheckboxGroup>
              <CheckboxGroupItem
                label="En saa tukea"
                className="group__item"
                checked={noSupport}
                onChange={this.handleCheckboxItemChange("noSupport")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Perheenjäseneltä"
                className="group__item"
                checked={family}
                onChange={this.handleCheckboxItemChange("family")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Ystävältä"
                className="group__item"
                checked={friend}
                onChange={this.handleCheckboxItemChange("friend")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Tukihenkilöltä"
                className="group__item"
                checked={supportPerson}
                onChange={this.handleCheckboxItemChange("supportPerson")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Opettajalta"
                className="group__item"
                checked={teacher}
                onChange={this.handleCheckboxItemChange("teacher")}
                disabled={this.props.disabled}
              />
              <CheckboxGroupItem
                label="Muu? Kuka?"
                className="group__item"
                checked={this.state.somethingElse}
                onChange={this.handleCheckboxElseChanges("somethingElse")}
                disabled={this.props.disabled}
              />
            </CheckboxGroup>
          </div>
          <AnimateHeight height={this.state.somethingElse ? "auto" : 0}>
            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <Textarea
                  className="form-element__textarea form-element__textarea--resize__vertically"
                  label="Muu?"
                  value={somethingElse}
                  onChange={this.handleTextareaChange("somethingElse")}
                  disabled={this.props.disabled}
                />
              </div>
            </div>
          </AnimateHeight>
        </fieldset>

        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Muuta?</legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                className="form-element__textarea form-element__textarea--resize__vertically"
                label="Mikä sinusta on opiskelussa helpointa/vaikeinta?"
                value={hardOrEasyInStudies}
                onChange={this.handleTextareaChange("hardOrEasyInStudies")}
                disabled={this.props.disabled}
              />
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                className="form-element__textarea form-element__textarea--resize__vertically"
                label="Mitkä ovat vahvuuksiasi/heikkouksiasi?"
                value={strengthsOrWeaknesses}
                onChange={this.handleTextareaChange("strengthsOrWeaknesses")}
                disabled={this.props.disabled}
              />
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                className="form-element__textarea form-element__textarea--resize__vertically"
                label="Mikä sinua tällä hetkellä kiinnostaa eniten?"
                value={interests}
                onChange={this.handleTextareaChange("interests")}
                disabled={this.props.disabled}
              />
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                className="form-element__textarea form-element__textarea--resize__vertically"
                label="Missä haluaisit erityisesti kehittyä?"
                value={areasToAdvance}
                onChange={this.handleTextareaChange("areasToAdvance")}
                disabled={this.props.disabled}
              />
            </div>
          </div>
        </fieldset>

        {/* <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Tavoitteet</legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <label className="hops-label">Valmistumisaikatavoite:</label>
              <select
                value={graduationGoal}
                onChange={this.handleGoalsSelectsChange("graduationGoal")}
                className="hops-select"
              >
                <option value="">Valitse...</option>
                <option value={6}>6kk</option>
                <option value={12}>1v.</option>
                <option value={18}>1,5v.</option>
                <option value={24}>2v.</option>
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
        </fieldset> */}
      </div>
    );
  }
}

export default MotivationAndStudySkills;
