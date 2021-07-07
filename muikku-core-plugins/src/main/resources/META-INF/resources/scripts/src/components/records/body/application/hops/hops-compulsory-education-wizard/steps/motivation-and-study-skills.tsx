import * as React from "react";
import { Textarea } from "../text-area";
import { CheckboxGroup, CheckboxGroupItem } from "../checkbox-group";
import {
  HopsMotivationAndStudy,
  FollowUpGoal,
  FollowUpStudies,
  StudySector,
} from "../../../../../../../@types/shared";

interface MotivationAndStudySkillsProps {
  onMotivationAndStudyChange: (
    motivationAndStudy: HopsMotivationAndStudy
  ) => void;
  motivationAndStudy: HopsMotivationAndStudy;
}

interface MotivationAndStudySkillsState {}

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

    this.state = {};
  }

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
              />
              <CheckboxGroupItem
                label="Kuuntelemalla"
                className="group__item"
                checked={byListening}
                onChange={this.handleCheckboxItemChange("byListening")}
              />
              <CheckboxGroupItem
                label="Tekemällä"
                className="group__item"
                checked={byDoing}
                onChange={this.handleCheckboxItemChange("byDoing")}
              />
            </CheckboxGroup>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                className="form-element__textarea form-element__textarea--resize__vertically"
                label="Muu?"
                value={someOtherWay}
                onChange={this.handleTextareaChange("someOtherWay")}
              />
            </div>
          </div>
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
              />
              <CheckboxGroupItem
                label="Kirjoitan muistiinpanoja"
                className="group__item"
                checked={byTakingNotes}
                onChange={this.handleCheckboxItemChange("byTakingNotes")}
              />
              <CheckboxGroupItem
                label="Piirrän kuvioita"
                className="group__item"
                checked={byDrawing}
                onChange={this.handleCheckboxItemChange("byDrawing")}
              />
              <CheckboxGroupItem
                label="Kuuntelen opettaja"
                className="group__item"
                checked={byListeningTeacher}
                onChange={this.handleCheckboxItemChange("byListeningTeacher")}
              />
              <CheckboxGroupItem
                label="Katson videoita"
                className="group__item"
                checked={byWatchingVideos}
                onChange={this.handleCheckboxItemChange("byWatchingVideos")}
              />
              <CheckboxGroupItem
                label="Seuraan toisen tekemistä"
                className="group__item"
                checked={byFollowingOthers}
                onChange={this.handleCheckboxItemChange("byFollowingOthers")}
              />
            </CheckboxGroup>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                className="form-element__textarea form-element__textarea--resize__vertically"
                label="Muu?"
                value={someOtherMethod}
                onChange={this.handleTextareaChange("someOtherMethod")}
              />
            </div>
          </div>
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
              />
              <CheckboxGroupItem
                label="Perheenjäseneltä"
                className="group__item"
                checked={family}
                onChange={this.handleCheckboxItemChange("family")}
              />
              <CheckboxGroupItem
                label="Ystävältä"
                className="group__item"
                checked={friend}
                onChange={this.handleCheckboxItemChange("friend")}
              />
              <CheckboxGroupItem
                label="Tukihenkilöltä"
                className="group__item"
                checked={supportPerson}
                onChange={this.handleCheckboxItemChange("supportPerson")}
              />
              <CheckboxGroupItem
                label="Opettajalta"
                className="group__item"
                checked={teacher}
                onChange={this.handleCheckboxItemChange("teacher")}
              />
            </CheckboxGroup>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                className="form-element__textarea form-element__textarea--resize__vertically"
                label="Muu?"
                value={somethingElse}
                onChange={this.handleTextareaChange("somethingElse")}
              />
            </div>
          </div>
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
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="hops-container__fieldset">
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
                <option value="6kk">6kk</option>
                <option value="12kk">1v.</option>
                <option value="18kk">1,5v.</option>
                <option value="24kk">2v.</option>
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
        </fieldset>
      </div>
    );
  }
}

export default MotivationAndStudySkills;
