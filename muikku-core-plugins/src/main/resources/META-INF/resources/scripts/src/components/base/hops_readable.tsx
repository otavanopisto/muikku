import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import { AnyActionType } from "~/actions";
import { HopsUppersecondary } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { StatusType } from "~/reducers/base/status";

/**
 * HopsProps
 */
interface HopsProps extends WithTranslation {
  data?: HopsUppersecondary;
  defaultData: HopsUppersecondary;
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

    this.state = {
      hops: props.data || props.defaultData,
    };
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps: HopsProps) {
    const nextData = nextProps.data || nextProps.defaultData;
    if (nextData !== this.state.hops) {
      this.setState({ hops: nextData });
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    if (!this.props.data || !this.props.data.optedIn) {
      return null;
    }

    const valueToLanguageString: { [key: string]: string } = {
      yes: t("labels.yes"),
      no: t("labels.no"),
      maybe: t("labels.maybe", { ns: "hops" }),
      AI: t("content.finnish", {
        ns: "hops",
        context: "native",
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
      <div className="application-sub-panel__body">
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.targetUpperSecondary", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.goalSecondarySchoolDegree
                ? valueToLanguageString[
                    this.state.hops.goalSecondarySchoolDegree
                  ]
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.targetMatriculationExam", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.goalMatriculationExam
                ? valueToLanguageString[this.state.hops.goalMatriculationExam]
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.iHave", { ns: "hops" })}
            <span className="application-sub-panel__item-inline-value">
              {this.state.hops.vocationalYears
                ? this.state.hops.vocationalYears
                : "-"}
            </span>
            {t("content.vocationalYears", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.goalJustMatriculationExam
                ? valueToLanguageString[
                    this.state.hops.goalJustMatriculationExam
                  ]
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.iHave", { ns: "hops" })}
            <span className="application-sub-panel__item-inline-value">
              {this.state.hops.transferCreditYears
                ? this.state.hops.transferCreditYears
                : "-"}
            </span>
            {t("content.justTransferCredits", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.justTransferCredits
                ? valueToLanguageString[this.state.hops.justTransferCredits]
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.completionEstimateYears1", { ns: "hops" })}
            <span className="application-sub-panel__item-inline-value">
              {this.state.hops.completionYears
                ? this.state.hops.completionYears
                : "-"}
            </span>
            {t("content.completionEstimateYears2", { ns: "hops" })}
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.finnishMandatority", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.finnish
                ? "-"
                : valueToLanguageString[this.state.hops.finnish]}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.otherMandatoryLanguages", { ns: "hops" })}
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.studyOptionalLanguages", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <label className="application-sub-panel__item-label">
              {t("labels.german", { ns: "hops" })}
            </label>
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.german
                ? "-"
                : this.state.hops.german
                ? t("labels.yes")
                : t("labels.yes")}
            </span>
          </div>
          <div className="application-sub-panel__item-data">
            <label className="application-sub-panel__item-label">
              {t("labels.french", { ns: "hops" })}
            </label>
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.french
                ? "-"
                : this.state.hops.french
                ? t("labels.yes")
                : t("labels.yes")}
            </span>
          </div>
          <div className="application-sub-panel__item-data">
            <label className="application-sub-panel__item-label">
              {t("labels.italian", { ns: "hops" })}
            </label>
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.italian
                ? "-"
                : this.state.hops.italian
                ? t("labels.yes")
                : t("labels.yes")}
            </span>
          </div>
          <div className="application-sub-panel__item-data">
            <label className="application-sub-panel__item-label">
              {t("labels.spanish", { ns: "hops" })}
            </label>
            <span className="application-sub-panel__single-entry">
              {!this.state.hops.spanish
                ? "-"
                : this.state.hops.spanish
                ? t("labels.yes")
                : t("labels.yes")}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("content.mathSyllabus", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.mathSyllabus
                ? valueToLanguageString[this.state.hops.mathSyllabus]
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {this.props.status.profile.curriculumName === "OPS 2016"
              ? t("labels.ops2016", { ns: "hops" })
              : t("labels.ops2021", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.science
                ? valueToLanguageString[this.state.hops.science]
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
          <div className="application-sub-panel__item-title">
            {t("labels.beliefSubjectIs", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.state.hops.religion
                ? valueToLanguageString[this.state.hops.religion]
                : "-"}
            </span>
          </div>
        </div>
        {this.state.hops.additionalInfo ? (
          <div className="application-sub-panel__item application-sub-panel__item--hops-readable">
            <div className="application-sub-panel__item-title">
              {t("labels.additionalInfo", { ns: "hops" })}
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
