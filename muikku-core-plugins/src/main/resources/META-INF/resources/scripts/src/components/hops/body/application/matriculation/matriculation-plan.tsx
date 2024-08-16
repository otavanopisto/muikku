import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops";
import MatriculationSubjectsList from "./components/matriculation-subjects-listV2";

/**
 * MatriculationPlanProps
 */
interface MatriculationPlanProps {
  hops: HopsState;
}

/**
 * MatriculationPlan
 * @param props props
 */
const MatriculationPlan = (props: MatriculationPlanProps) => {
  const { hops } = props;

  const { t } = useTranslation(["hops", "guider", "common"]);

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
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
    <>
      <ApplicationSubPanel>
        <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
          <div className="application-sub-panel__item-title">
            {t("content.targetMatriculationExam", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            {["yes", "no", "maybe"].map((option) => (
              <div
                className="form-element form-element--checkbox-radiobutton"
                key={option}
              >
                <input
                  id={"goalMatriculationExam" + option}
                  type="radio"
                  value={option}
                />
                <label htmlFor={"goalMatriculationExam" + option}>
                  {valueToLanguageString[option]}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
          <div className="application-sub-panel__item-title">
            {t("content.matriculationSubjectsGoal", { ns: "hops" })}
          </div>
          <div className="application-sub-panel__item-data">
            <MatriculationSubjectsList />
          </div>
        </div>
      </ApplicationSubPanel>
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MatriculationPlan);
