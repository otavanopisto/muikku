import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import MatriculationSubjectsList from "../records/body/application/matriculation-subjects/matriculation-subjects-list";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";

/**
 * HopsProps
 */
interface HopsProps {
  data?: HOPSDataType;
  defaultData: HOPSDataType;
  onHopsChange?: (hops: HOPSDataType) => any;
  i18n: i18nType;
}

/**
 * HopsState
 */
interface HopsState {
  hops: HOPSDataType;
}

/**
 * Hops
 */
class Hops extends React.Component<HopsProps, HopsState> {
  /**
   * @param props
   */
  constructor(props: HopsProps) {
    super(props);

    this.set = this.set.bind(this);
    this.setFromEventValue = this.setFromEventValue.bind(this);

    this.state = {
      hops: props.data || props.defaultData,
    };
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  componentWillReceiveProps(nextProps: HopsProps) {
    const nextData = nextProps.data || nextProps.defaultData;
    if (nextData !== this.state.hops) {
      this.setState({ hops: nextData });
    }
  }

  /**
   * set
   * @param property property
   * @param value value
   */
  set(property: string, value: any) {
    const nProp: any = {};
    nProp[property] = value || null;
    const nval = Object.assign({}, this.state.hops, nProp);
    this.props.onHopsChange && this.props.onHopsChange(nval);

    this.setState({
      hops: nval,
    });
  }

  /**
   * setFromEventValue
   * @param property property
   * @param e e
   */
  setFromEventValue(property: string, e: React.ChangeEvent<HTMLInputElement>) {
    return this.set(property, e.target.value);
  }

  /**
   * Event handler for handling matriculation subjects changes
   *
   * @param subjects list of subjects
   */
  onMatriculationSubjectsChange = (subjects: string[]) => {
    this.set("studentMatriculationSubjects", subjects);
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const data = this.props.data || this.props.defaultData;
    if (!data || !data.optedIn) {
      return null;
    }
    return (
      <div className="application-sub-panel">
        <div className="application-sub-panel__body">
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.upperSecondary"
              )}
            </div>
            <div className="application-sub-panel__item-data form-element">
              {["yes", "no", "maybe"].map((option: string) => {
                const onEvent = this.set.bind(
                  this,
                  "goalSecondarySchoolDegree",
                  option
                );
                return (
                  <div
                    className="form-element form-element--checkbox-radiobutton"
                    key={option}
                  >
                    <input
                      id={"goalSecondarySchoolDegree" + option}
                      type="radio"
                      value={option}
                      checked={
                        this.state.hops.goalSecondarySchoolDegree === option
                      }
                      onChange={onEvent}
                    />
                    <label
                      htmlFor={"goalSecondarySchoolDegree" + option}
                      onClick={onEvent}
                    >
                      {this.props.i18n.text.get(
                        "plugin.records.hops.goals." + option
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.matriculationExam"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              {["yes", "no", "maybe"].map((option: string) => {
                const onEvent = this.set.bind(
                  this,
                  "goalMatriculationExam",
                  option
                );
                return (
                  <div
                    className="form-element form-element--checkbox-radiobutton"
                    key={option}
                  >
                    <input
                      id={"goalMatriculationExam" + option}
                      type="radio"
                      value={option}
                      checked={this.state.hops.goalMatriculationExam === option}
                      onChange={onEvent}
                    />
                    <label
                      htmlFor={"goalMatriculationExam" + option}
                      onClick={onEvent}
                    >
                      {this.props.i18n.text.get(
                        "plugin.records.hops.goals." + option
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          {this.state.hops.goalMatriculationExam === "yes" && (
            <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
              <div className="application-sub-panel__item-title">
                {this.props.i18n.text.get(
                  "plugin.records.hops.goals.matriculationSubjects"
                )}
              </div>
              <div className="application-sub-panel__item-data">
                <MatriculationSubjectsList
                  initialMatriculationSubjects={
                    this.state.hops.studentMatriculationSubjects
                  }
                  onMatriculationSubjectsChange={
                    this.onMatriculationSubjectsChange
                  }
                />
              </div>
            </div>
          )}
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title form-element">
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.vocationalYears1"
              )}
              <label htmlFor="vocationalYears" className="visually-hidden">
                {this.props.i18n.text.get("plugin.wcag.selectYearCount.label")}
              </label>
              <select
                id="vocationalYears"
                className="form-element__select form-element__select--hops-selector"
                value={this.state.hops.vocationalYears || ""}
                onChange={this.setFromEventValue.bind(this, "vocationalYears")}
              >
                <option disabled value="">
                  {this.props.i18n.text.get(
                    "plugin.records.hops.selectAnOption"
                  )}
                </option>
                {["1", "2", "2,5", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.vocationalYears2"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              {["yes", "no"].map((option: string) => {
                const onEvent = this.set.bind(
                  this,
                  "goalJustMatriculationExam",
                  option
                );
                return (
                  <div
                    className="form-element form-element--checkbox-radiobutton"
                    key={option}
                  >
                    <input
                      id={"goalJustMatriculationExam" + option}
                      type="radio"
                      value={option}
                      checked={
                        this.state.hops.goalJustMatriculationExam === option
                      }
                      onChange={onEvent}
                    />
                    <label
                      htmlFor={"goalJustMatriculationExam" + option}
                      onClick={onEvent}
                    >
                      {this.props.i18n.text.get(
                        "plugin.records.hops.goals." + option
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title form-element">
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.justTransferCredits1"
              )}
              <label htmlFor="transferCreditYears" className="visually-hidden">
                {this.props.i18n.text.get("plugin.wcag.selectYearCount.label")}
              </label>
              <select
                id="transferCreditYears"
                className="form-element__select form-element__select--hops-selector"
                value={this.state.hops.transferCreditYears || ""}
                onChange={this.setFromEventValue.bind(
                  this,
                  "transferCreditYears"
                )}
              >
                <option disabled value="">
                  {this.props.i18n.text.get(
                    "plugin.records.hops.selectAnOption"
                  )}
                </option>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.justTransferCredits2"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              {["yes", "no"].map((option: string) => {
                const onEvent = this.set.bind(
                  this,
                  "justTransferCredits",
                  option
                );
                return (
                  <div
                    className="form-element form-element--checkbox-radiobutton"
                    key={option}
                  >
                    <input
                      id={"justTransferCredits" + option}
                      type="radio"
                      value={option}
                      checked={this.state.hops.justTransferCredits === option}
                      onChange={onEvent}
                    />
                    <label
                      htmlFor={"justTransferCredits" + option}
                      onClick={onEvent}
                    >
                      {this.props.i18n.text.get(
                        "plugin.records.hops.goals." + option
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title form-element">
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.completionYears1"
              )}
              <label htmlFor="completionYears" className="visually-hidden">
                {this.props.i18n.text.get("plugin.wcag.selectYearCount.label")}
              </label>
              <select
                id="completionYears"
                className="form-element__select form-element__select--hops-selector"
                value={this.state.hops.completionYears || ""}
                onChange={this.setFromEventValue.bind(this, "completionYears")}
              >
                <option disabled value="">
                  {this.props.i18n.text.get(
                    "plugin.records.hops.selectAnOption"
                  )}
                </option>
                {["1", "2", "3", "4"].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              {this.props.i18n.text.get(
                "plugin.records.hops.goals.completionYears2"
              )}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.records.hops.languages.mandatory.title"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              {["AI", "S2"].map((option: string) => {
                const onEvent = this.set.bind(this, "finnish", option);
                const nativity: any = { AI: "native", S2: "foreign" };
                return (
                  <div
                    className="form-element form-element--checkbox-radiobutton"
                    key={option}
                  >
                    <input
                      id={"finnish" + option}
                      type="radio"
                      value={option}
                      checked={this.state.hops.finnish === option}
                      onChange={onEvent}
                    />
                    <label htmlFor={"finnish" + option} onClick={onEvent}>
                      {this.props.i18n.text.get(
                        "plugin.records.hops.languages.finnish." +
                          nativity[option]
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
              {this.props.i18n.text.get(
                "plugin.records.hops.languages.mandatory.additionalInfo"
              )}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.records.hops.languages.optional.title"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="langGerman"
                  type="checkbox"
                  checked={this.state.hops.german}
                  onChange={this.set.bind(
                    this,
                    "german",
                    !this.state.hops.german
                  )}
                />
                <label htmlFor="langGerman">
                  {this.props.i18n.text.get(
                    "plugin.records.hops.languages.german"
                  )}
                </label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="langFrench"
                  type="checkbox"
                  checked={this.state.hops.french}
                  onChange={this.set.bind(
                    this,
                    "french",
                    !this.state.hops.french
                  )}
                />
                <label htmlFor="langFrench">
                  {this.props.i18n.text.get(
                    "plugin.records.hops.languages.french"
                  )}
                </label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="langItalian"
                  type="checkbox"
                  checked={this.state.hops.italian}
                  onChange={this.set.bind(
                    this,
                    "italian",
                    !this.state.hops.italian
                  )}
                />
                <label htmlFor="langItalian">
                  {this.props.i18n.text.get(
                    "plugin.records.hops.languages.italian"
                  )}
                </label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="langSpanish"
                  type="checkbox"
                  checked={this.state.hops.spanish}
                  onChange={this.set.bind(
                    this,
                    "spanish",
                    !this.state.hops.spanish
                  )}
                />
                <label htmlFor="langSpanish">
                  {this.props.i18n.text.get(
                    "plugin.records.hops.languages.spanish"
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.records.hops.mathSyllabus.title"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              {["MAA", "MAB"].map((option: string) => {
                const onEvent = this.set.bind(this, "mathSyllabus", option);
                return (
                  <div
                    className="form-element form-element--checkbox-radiobutton"
                    key={option}
                  >
                    <input
                      id={"mathSyllabus" + option}
                      type="radio"
                      value={option}
                      checked={this.state.hops.mathSyllabus === option}
                      onChange={onEvent}
                    />
                    <label htmlFor={"mathSyllabus" + option} onClick={onEvent}>
                      {this.props.i18n.text.get(
                        "plugin.records.hops.mathSyllabus." + option
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get("plugin.records.hops.science.title")}
            </div>
            <div className="application-sub-panel__item-data">
              {["BI", "FY", "KE", "GE"].map((option: string) => {
                const onEvent = this.set.bind(this, "science", option);
                return (
                  <div
                    className="form-element form-element--checkbox-radiobutton"
                    key={option}
                  >
                    <input
                      id={"science" + option}
                      type="radio"
                      value={option}
                      checked={this.state.hops.science === option}
                      onChange={onEvent}
                    />
                    <label htmlFor={"science" + option} onClick={onEvent}>
                      {this.props.i18n.text.get(
                        "plugin.records.hops.science." + option
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get("plugin.records.hops.religion.title")}
            </div>
            <div className="application-sub-panel__item-data">
              {["UE", "ET", "UX"].map((option: string) => {
                const onEvent = this.set.bind(this, "religion", option);
                return (
                  <div
                    className="form-element form-element--checkbox-radiobutton"
                    key={option}
                  >
                    <input
                      id={"religion" + option}
                      type="radio"
                      value={option}
                      checked={this.state.hops.religion === option}
                      onChange={onEvent}
                    />
                    <label htmlFor={"religion" + option} onClick={onEvent}>
                      {this.props.i18n.text.get(
                        "plugin.records.hops.religion." + option
                      )}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable form-element">
            <label
              htmlFor="additionalInfo"
              className="application-sub-panel__item-title"
            >
              {this.props.i18n.text.get(
                "plugin.records.hops.additionalInfo.title"
              )}
            </label>
            <div className="application-sub-panel__item-data form-element__textarea-container">
              <textarea
                id="additionalInfo"
                className="form-element__textarea"
                onChange={this.setFromEventValue.bind(this, "additionalInfo")}
                value={this.state.hops.additionalInfo || ""}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    defaultData: state.hops && state.hops.value,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Hops);
