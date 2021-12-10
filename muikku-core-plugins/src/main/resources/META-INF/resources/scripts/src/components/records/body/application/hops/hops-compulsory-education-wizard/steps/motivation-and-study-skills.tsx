import * as React from "react";
import { Textarea } from "../text-area";
import { CheckboxGroupItem, ScaleInputGroup } from "../input-groups";
import { HopsMotivationAndStudy } from "../../../../../../../@types/shared";
import AnimateHeight from "react-animate-height";
import { InputGroup } from "../input-groups";

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
      if (e.target.checked) {
        this.props.onMotivationAndStudyChange({
          ...this.props.motivationAndStudy,
          [name]: "",
        });
      } else {
        this.props.onMotivationAndStudyChange({
          ...this.props.motivationAndStudy,
          [name]: undefined,
        });
      }

      this.setState({
        ...this.state,
        [name]: e.target.checked,
      });
    };

  /**
   * handleScaleRangeChange
   * @param name
   * @returns
   */
  handleScaleRangeChange = (
    name: keyof HopsMotivationAndStudy,
    scaleValue: number
  ) => {
    this.props.onMotivationAndStudyChange({
      ...this.props.motivationAndStudy,
      [name]: scaleValue,
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
          <legend className="hops-container__subheader">
            Miten opin? Asteikolla 0-4.
          </legend>

          <div className="hops-container__row hops-container__row--list">
            <InputGroup>
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Lukemalla"
                value={byReading}
                name="byReading"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Kuuntelemalla"
                value={byListening}
                name="byListening"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Tekemällä"
                value={byDoing}
                name="byDoing"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <CheckboxGroupItem
                label="Muu? Mikä?"
                modifiers={["checkbox"]}
                checked={this.state.someOtherWay}
                onChange={this.handleCheckboxElseChanges("someOtherWay")}
                disabled={this.props.disabled}
              />
            </InputGroup>
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
            Millaisia tapoja olen aiemmin käyttänyt? Asteikolla 0-4.
          </legend>

          <div className="hops-container__row hops-container__row--list">
            <InputGroup>
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Opettelen asioita ulkoa"
                value={byMemorizing}
                name="byMemorizing"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Kirjoitan muistiinpanoja"
                value={byTakingNotes}
                name="byTakingNotes"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Piirrän kuvioita"
                value={byDrawing}
                name="byDrawing"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Kuuntelen opettaja"
                value={byListeningTeacher}
                name="byListeningTeacher"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Katson videoita"
                value={byWatchingVideos}
                name="byWatchingVideos"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Seuraan toisen tekemistä"
                value={byFollowingOthers}
                name="byFollowingOthers"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <CheckboxGroupItem
                label="Muu? Mikä?"
                modifiers={["checkbox"]}
                checked={this.state.someOtherMethod}
                onChange={this.handleCheckboxElseChanges("someOtherMethod")}
                disabled={this.props.disabled}
              />
            </InputGroup>
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
            Keneltä saan tukea opiskeluun? Asteikolla 0-4.
          </legend>

          <div className="hops-container__row hops-container__row--list">
            <InputGroup>
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="En saa tukea"
                value={noSupport}
                name="noSupport"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Perheenjäseneltä"
                value={family}
                name="family"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Ystävältä"
                value={friend}
                name="friend"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Tukihenkilöltä"
                value={supportPerson}
                name="supportPerson"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <ScaleInputGroup<HopsMotivationAndStudy>
                label="Opettajalta"
                value={teacher}
                name="teacher"
                onChangeScaleGroup={this.handleScaleRangeChange}
                disabled={this.props.disabled}
                scaleSize={this.props.motivationAndStudy.scaleSize}
              />
              <CheckboxGroupItem
                label="Muu? Kuka?"
                modifiers={["checkbox"]}
                checked={this.state.somethingElse}
                onChange={this.handleCheckboxElseChanges("somethingElse")}
                disabled={this.props.disabled}
              />
            </InputGroup>
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
