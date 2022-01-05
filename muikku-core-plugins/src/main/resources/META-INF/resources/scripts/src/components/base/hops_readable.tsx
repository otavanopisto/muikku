import * as React from "react";

import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";

import "~/sass/elements/hops.scss";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";

interface HopsProps {
  data?: HOPSDataType;
  defaultData: HOPSDataType;
  i18n: i18nType;
}

interface HopsState {
  hops: HOPSDataType;
}

class Hops extends React.Component<HopsProps, HopsState> {
  constructor(props: HopsProps) {
    super(props);

    this.state = {
      hops: props.data || props.defaultData,
    };
  }

  componentWillReceiveProps(nextProps: HopsProps) {
    const nextData = nextProps.data || nextProps.defaultData;
    if (nextData !== this.state.hops) {
      this.setState({ hops: nextData });
    }
  }
  render() {
    if (!this.props.data || !this.props.data.optedIn) {
      return null;
    }

    return (
      <div className="application-sub-panel__body">
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.upperSecondary",
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.goalSecondarySchoolDegree
                ? this.props.i18n.text.get(
                    "plugin.records.hops.goals." +
                      this.state.hops.goalSecondarySchoolDegree,
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.matriculationExam",
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.goalMatriculationExam
                ? this.props.i18n.text.get(
                    "plugin.records.hops.goals." +
                      this.state.hops.goalMatriculationExam,
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.vocationalYears1",
            )}
            <span className="application-sub-panel__item-inline-value">
              {this.state.hops.vocationalYears
                ? this.state.hops.vocationalYears
                : "-"}
            </span>
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.vocationalYears2",
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.goalJustMatriculationExam
                ? this.props.i18n.text.get(
                    "plugin.records.hops.goals." +
                      this.state.hops.goalJustMatriculationExam,
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.justTransferCredits1",
            )}
            <span className="application-sub-panel__item-inline-value">
              {this.state.hops.transferCreditYears
                ? this.state.hops.transferCreditYears
                : "-"}
            </span>
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.justTransferCredits2",
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.justTransferCredits
                ? this.props.i18n.text.get(
                    "plugin.records.hops.goals." +
                      this.state.hops.justTransferCredits,
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.completionYears1",
            )}
            <span className="application-sub-panel__item-inline-value">
              {this.state.hops.completionYears
                ? this.state.hops.completionYears
                : "-"}
            </span>
            {this.props.i18n.text.get(
              "plugin.records.hops.goals.completionYears2",
            )}
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.records.hops.languages.mandatory.title",
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.finnish
                ? "-"
                : this.state.hops.finnish === "AI"
                ? this.props.i18n.text.get(
                    "plugin.records.hops.languages.finnish.native",
                  )
                : this.props.i18n.text.get(
                    "plugin.records.hops.languages.finnish.foreign",
                  )}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.records.hops.languages.mandatory.additionalInfo",
            )}
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.records.hops.languages.optional.title",
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <label className="application-sub-panel__item-label">
              {this.props.i18n.text.get("plugin.records.hops.languages.german")}
            </label>
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.german
                ? "-"
                : this.state.hops.german
                ? this.props.i18n.text.get("plugin.records.hops.goals.yes")
                : this.props.i18n.text.get("plugin.records.hops.goals.no")}
            </span>
          </div>
          <div className="application-sub-panel__item-data">
            <label className="application-sub-panel__item-label">
              {this.props.i18n.text.get("plugin.records.hops.languages.french")}
            </label>
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.french
                ? "-"
                : this.state.hops.french
                ? this.props.i18n.text.get("plugin.records.hops.goals.yes")
                : this.props.i18n.text.get("plugin.records.hops.goals.no")}
            </span>
          </div>
          <div className="application-sub-panel__item-data">
            <label className="application-sub-panel__item-label">
              {this.props.i18n.text.get(
                "plugin.records.hops.languages.italian",
              )}
            </label>
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.italian
                ? "-"
                : this.state.hops.italian
                ? this.props.i18n.text.get("plugin.records.hops.goals.yes")
                : this.props.i18n.text.get("plugin.records.hops.goals.no")}
            </span>
          </div>
          <div className="application-sub-panel__item-data">
            <label className="application-sub-panel__item-label">
              {this.props.i18n.text.get(
                "plugin.records.hops.languages.spanish",
              )}
            </label>
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.spanish
                ? "-"
                : this.state.hops.spanish
                ? this.props.i18n.text.get("plugin.records.hops.goals.yes")
                : this.props.i18n.text.get("plugin.records.hops.goals.no")}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get("plugin.records.hops.mathSyllabus.title")}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.mathSyllabus
                ? this.props.i18n.text.get(
                    "plugin.records.hops.mathSyllabus." +
                      this.state.hops.mathSyllabus,
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get("plugin.records.hops.science.title")}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.science
                ? this.props.i18n.text.get(
                    "plugin.records.hops.science." + this.state.hops.science,
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get("plugin.records.hops.religion.title")}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.religion
                ? this.props.i18n.text.get(
                    "plugin.records.hops.religion." + this.state.hops.religion,
                  )
                : "-"}
            </span>
          </div>
        </div>
        {this.state.hops.additionalInfo ? (
          <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.records.hops.additionalInfo.title",
              )}
            </div>
            <div className="application-sub-panel__item-data">
              <span className="application-sub-panel__single-entry">
                {this.state.hops.additionalInfo}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    defaultData: state.hops && state.hops.value,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Hops);
