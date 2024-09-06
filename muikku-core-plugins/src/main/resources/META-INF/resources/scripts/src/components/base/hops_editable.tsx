import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import MatriculationSubjectsList from "../records/body/application/matriculation-subjects/matriculation-subjects-list";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";
import { HopsUppersecondary } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * HopsProps
 */
interface HopsProps extends WithTranslation {
  data?: HopsUppersecondary;
  defaultData: HopsUppersecondary;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onHopsChange?: (hops: HopsUppersecondary) => any;
  status: StatusType;
}

/**
 * HopsState
 */
interface HopsState {
  hops: HopsUppersecondary;
}

/**
 * Hops
 */
class Hops extends React.Component<HopsProps, HopsState> {
  /**
   * constructor
   * @param props props
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
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: HopsProps) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(property: string, value: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const { t } = this.props;

    const data = this.props.data || this.props.defaultData;
    if (!data || !data.optedIn) {
      return null;
    }

    const valueToLanguageString: { [key: string]: string } = {
      yes: t("labels.yes"),
      no: t("labels.no"),
      maybe: t("labels.maybe", { ns: "hops" }),
      AI: t("content.finnish", {
        ns: "hops",
      }),
      S2: t("content.finnish", {
        ns: "hops",
        context: "secondary",
      }),
      MAA: t("labels.longSyllabus", { ns: "hops" }),
      MAB: t("labels.shortSyllabus", { ns: "hops" }),
      BI: t("labels.biology", { ns: "hops" }),
      FY: t("labels.physics", { ns: "hops" }),
      GE: t("labels.geography", { ns: "hops" }),
      KE: t("labels.chemistry", { ns: "hops" }),
      UE: t("labels.religionEl", { ns: "hops" }),
      ET: t("labels.ethics", { ns: "hops" }),
      UX: t("labels.religionOther", { ns: "hops" }),
    };

    return (
      <div className="application-sub-panel">
        <div className="application-sub-panel__body">
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {t("content.targetUpperSecondary", { ns: "hops" })}
            </div>
            <div className="application-sub-panel__item-data form-element">
              {["yes", "no", "maybe"].map((option) => {
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
                      {valueToLanguageString[option]}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {t("content.targetMatriculationExam", { ns: "hops" })}
            </div>
            <div className="application-sub-panel__item-data">
              {["yes", "no", "maybe"].map((option) => {
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
                      {valueToLanguageString[option]}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          {this.state.hops.goalMatriculationExam === "yes" && (
            <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
              <div className="application-sub-panel__item-title">
                {t("content.matriculationSubjectsGoal", { ns: "hops" })}
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
              {t("content.iHave", { ns: "hops" })}
              <label htmlFor="vocationalYears" className="visually-hidden">
                {t("wcag.selectYearCount", { ns: "guider" })}
              </label>
              <select
                id="vocationalYears"
                className="form-element__select form-element__select--hops-selector"
                value={this.state.hops.vocationalYears || ""}
                onChange={this.setFromEventValue.bind(this, "vocationalYears")}
              >
                <option disabled value="">
                  {t("labels.select")}
                </option>
                {["1", "2", "2,5", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>

              {t("content.vocationalYears", { ns: "hops" })}
            </div>
            <div className="application-sub-panel__item-data">
              {["yes", "no"].map((option) => {
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
                      {valueToLanguageString[option]}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title form-element">
              {t("content.iHave", { ns: "hops" })}
              <label htmlFor="transferCreditYears" className="visually-hidden">
                {t("wcag.selectYearCount", { ns: "guider" })}
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
                  {t("labels.select")}
                </option>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].map(
                  (n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  )
                )}
              </select>

              {t("content.justTransferCredits", { ns: "hops" })}
            </div>
            <div className="application-sub-panel__item-data">
              {["yes", "no"].map((option) => {
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
                      {valueToLanguageString[option]}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title form-element">
              {t("content.completionEstimateYears1", { ns: "hops" })}
              <label htmlFor="completionYears" className="visually-hidden">
                {t("wcag.selectYearCount", { ns: "guider" })}
              </label>
              <select
                id="completionYears"
                className="form-element__select form-element__select--hops-selector"
                value={this.state.hops.completionYears || ""}
                onChange={this.setFromEventValue.bind(this, "completionYears")}
              >
                <option disabled value="">
                  {t("labels.select")}
                </option>
                {["1", "2", "3", "4"].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              {t("content.completionEstimateYears2", { ns: "hops" })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {t("content.finnishMandatority", { ns: "hops" })}
            </div>
            <div className="application-sub-panel__item-data">
              {["AI", "S2"].map((option) => {
                const onEvent = this.set.bind(this, "finnish", option);

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
                      {valueToLanguageString[option]}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
              {t("content.otherMandatoryLanguages", { ns: "hops" })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {t("content.studyOptionalLanguages", { ns: "hops" })}
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
                  {t("labels.german", { ns: "hops" })}
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
                  {t("labels.french", { ns: "hops" })}
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
                  {t("labels.italian", { ns: "hops" })}
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
                  {t("labels.spanish", { ns: "hops" })}
                </label>
              </div>
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {t("content.mathSyllabus", { ns: "hops" })}
            </div>
            <div className="application-sub-panel__item-data">
              {["MAA", "MAB"].map((option) => {
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
                      {valueToLanguageString[option]}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {this.props.status.profile.curriculumName === "OPS 2016"
                ? t("labels.ops2016", { ns: "hops" })
                : t("labels.ops2021", { ns: "hops" })}
            </div>
            <div className="application-sub-panel__item-data">
              {["BI", "FY", "KE", "GE"].map((option) => {
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
                      {valueToLanguageString[option]}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
            <div className="application-sub-panel__item-title">
              {t("labels.beliefSubjectIs", { ns: "hops" })}
            </div>
            <div className="application-sub-panel__item-data">
              {["UE", "ET", "UX"].map((option) => {
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
                      {valueToLanguageString[option]}
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
              {t("labels.additionalInfo", { ns: "hops" })}
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
    defaultData: state.hops && state.hops.value,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["hops", "guider", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(Hops)
);
