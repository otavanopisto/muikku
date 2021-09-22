import * as React from "react";
import { Textarea } from "../text-area";
import { CheckboxGroup, CheckboxGroupItem } from "../checkbox-group";
import { HopsMotivationAndStudy } from "../../../../../../../@types/shared";
import AnimateHeight from "react-animate-height";

/**
 * MotivationAndStudySkillsProps
 */
interface MotivationAndStudySkillsProps {
  disabled: boolean;
  onMotivationAndStudyChange: (
    motivationAndStudy: HopsMotivationAndStudy
  ) => void;
  motivationAndStudy: HopsMotivationAndStudy;
}

/**
 * MotivationAndStudySkillsState
 */
interface MotivationAndStudySkillsState {
  someOtherWay: boolean;
  someOtherMethod: boolean;
  somethingElse: boolean;
}

/**
 * MotivationAndStudySkills
 */
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
      </div>
    );
  }
}

export default MotivationAndStudySkills;
