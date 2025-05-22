import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import {
  MatriculationExamTerm,
  MatriculationPlan,
  MatriculationPlanSubject,
} from "~/generated/client";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops";
import MatriculationSubjectsList, {
  SelectedMatriculationSubject,
} from "./components/matriculation-subjects-list";
import {
  UpdateHopsEditingTriggerType,
  updateHopsEditing,
} from "~/actions/main-function/hops/";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * MatriculationPlanProps
 */
interface MatriculationPlanProps {
  hops: HopsState;
  plan: MatriculationPlan;
  editingPlan: MatriculationPlan;
  updateHopsEditing: UpdateHopsEditingTriggerType;
}

/**
 * MatriculationPlan
 * @param props props
 */
const MatriculationPlan = (props: MatriculationPlanProps) => {
  const { plan, editingPlan, hops, updateHopsEditing } = props;

  const { t } = useTranslation(["hops_new", "guider", "common"]);

  // Memoized selected subjects
  const selectedSubjects = React.useMemo(() => {
    if (!plan || !editingPlan) return [];

    if (hops.hopsMode === "READ") {
      return plan.plannedSubjects.map<SelectedMatriculationSubject>(
        (subject) => ({
          subjectCode: subject.subject,
          term: subject.term ? `${subject.term}${subject.year}` : "",
        })
      );
    } else {
      return editingPlan.plannedSubjects.map<SelectedMatriculationSubject>(
        (subject) => ({
          subjectCode: subject.subject,
          term: subject.term ? `${subject.term}${subject.year}` : "",
        })
      );
    }
  }, [plan, editingPlan, hops.hopsMode]);

  /**
   * Handles checkbox change
   *
   * @param event event
   */
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updateMatriculationPlan = {
      ...editingPlan,
      goalMatriculationExam: event.target.checked,
    };

    updateHopsEditing({
      updates: {
        matriculationPlan: updateMatriculationPlan,
      },
    });
  };

  /**
   * Handles matriculation subjects change.
   *
   * @param selectSubjects Selected subjects
   */
  const handleMatriculationSubjectsChange = React.useCallback(
    (selectSubjects: SelectedMatriculationSubject[]) => {
      const convertedList = selectSubjects.map<MatriculationPlanSubject>(
        (subject) => ({
          subject: subject.subjectCode,
          term: subject.term.substring(0, 6) as MatriculationExamTerm,
          year: parseInt(subject.term.substring(6)),
        })
      );

      updateHopsEditing({
        updates: {
          matriculationPlan: {
            ...editingPlan,
            plannedSubjects: convertedList,
          },
        },
      });
    },
    [editingPlan, updateHopsEditing]
  );

  if (
    hops.hopsMatriculationStatus !== "READY" ||
    plan === null ||
    editingPlan === null
  ) {
    return <div className="loader-empty" />;
  }

  return (
    <ApplicationSubPanel>
      <ApplicationSubPanel.Header>
        {t("labels.matriculationPlan", {
          context: "title",
          ns: "hops_new",
        })}
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel modifier="matriculation-plan-content">
        <ApplicationSubPanel modifier="matriculation-plan-data">
          <ApplicationSubPanel.Body>
            <div className="application-sub-panel__notification-item">
              <div className="application-sub-panel__notification-body">
                <div className="form__row">
                  <div className="form-element form-element--checkbox-radiobutton">
                    <input
                      id={"goalMatriculationExam"}
                      type="checkbox"
                      checked={editingPlan.goalMatriculationExam}
                      onChange={handleCheckboxChange}
                      disabled={hops.hopsMode === "READ"}
                    />
                    <label htmlFor="goalMatriculationExam">
                      {t("content.matriculationPlanTarget", { ns: "hops_new" })}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className=" application-sub-panel__notification-item">
              <div className="application-sub-panel__notification-body">
                <div className="application-sub-panel__notification-title">
                  {t("content.matriculationPlanSubjectGoal", {
                    ns: "hops_new",
                  })}
                </div>
                <MatriculationSubjectsList
                  disabled={hops.hopsMode === "READ"}
                  subjects={hops.hopsMatriculation.subjects}
                  selectedSubjects={selectedSubjects}
                  onSubjectsChange={handleMatriculationSubjectsChange}
                />
              </div>
            </div>
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
        <ApplicationSubPanel modifier="matriculation-plan-info">
          <ApplicationSubPanel.Body>
            <div className="matriculation-container__state state-INFO">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>
                  {t("content.matriculationPlanGuides1", { ns: "hops_new" })}
                </p>

                <ul>
                  <li>
                    {t("content.matriculationPlanGuideSubject1", {
                      ns: "hops_new",
                    })}
                  </li>
                  <li>
                    {t("content.matriculationPlanGuideSubject2", {
                      ns: "hops_new",
                    })}
                  </li>
                  <li>
                    {t("content.matriculationPlanGuideSubject3", {
                      ns: "hops_new",
                    })}
                  </li>
                  <li>
                    {t("content.matriculationPlanGuideSubject4", {
                      ns: "hops_new",
                    })}
                  </li>
                </ul>

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("content.matriculationPlanGuides2", {
                      ns: "hops_new",
                    }),
                  }}
                ></p>

                <p
                  dangerouslySetInnerHTML={{
                    __html: t("content.matriculationPlanGuides3", {
                      ns: "hops_new",
                    }),
                  }}
                ></p>
              </div>
            </div>
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
      </ApplicationSubPanel>
    </ApplicationSubPanel>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
    plan: state.hopsNew.hopsMatriculation.plan,
    editingPlan: state.hopsNew.hopsEditing.matriculationPlan,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ updateHopsEditing }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MatriculationPlan);
