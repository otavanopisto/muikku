import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
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
  SaveMatriculationPlanTriggerType,
  saveMatriculationPlan,
} from "../../../../../actions/main-function/hops/index";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import ItemList from "~/components/general/item-list";
import { useUseCaseContext } from "~/context/use-case-context";

/**
 * MatriculationPlanProps
 */
interface MatriculationPlanProps {
  hops: HopsState;
  plan: MatriculationPlan;
  saveMatriculationPlan: SaveMatriculationPlanTriggerType;
}

/**
 * MatriculationPlan
 * @param props props
 */
const MatriculationPlan = (props: MatriculationPlanProps) => {
  const { plan, hops, saveMatriculationPlan } = props;

  const { t } = useTranslation(["hops_new", "guider", "common"]);

  const useCase = useUseCaseContext();

  const [matriculationPlan, setMatriculationPlan] =
    React.useState<MatriculationPlan>({
      goalMatriculationExam: false,
      plannedSubjects: [],
    });

  const draftTimer = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // Memoized selected subjects
  const selectedSubjects = React.useMemo(() => {
    if (!plan) return [];

    return plan.plannedSubjects.map<SelectedMatriculationSubject>(
      (subject) => ({
        subjectCode: subject.subject,
        term: subject.term ? `${subject.term}${subject.year}` : "",
      })
    );
  }, [plan]);

  // Set initial values and update when plan changes
  React.useEffect(() => {
    if (!plan) {
      return;
    }

    unstable_batchedUpdates(() => {
      setMatriculationPlan(plan);
    });
  }, [plan]);

  /**
   * Saves plan after delay (1s)
   *
   * @param matriculationPlan examination
   * @param selectedSubjects selected subjects
   */
  const savePlanAfterDelay = React.useCallback(
    (
      matriculationPlan: MatriculationPlan,
      selectedSubjects: SelectedMatriculationSubject[]
    ) => {
      if (draftTimer.current) {
        clearTimeout(draftTimer.current);
        draftTimer.current = undefined;
      }

      draftTimer.current = setTimeout(() => {
        // Filter entries that contains empty values and
        // convert rest selected subjects to MatriculationPlanSubject
        const convertedList = selectedSubjects.map<MatriculationPlanSubject>(
          (subject) => ({
            subject: subject.subjectCode,
            term: subject.term.substring(0, 6) as MatriculationExamTerm,
            year: parseInt(subject.term.substring(6)),
          })
        );
        saveMatriculationPlan({
          ...matriculationPlan,
          plannedSubjects: convertedList,
        });
      }, 1000);
    },
    [saveMatriculationPlan]
  );

  /**
   * Handles checkbox change
   *
   * @param event event
   */
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updateMatriculationPlan = {
      ...matriculationPlan,
      goalMatriculationExam: event.target.checked,
    };

    savePlanAfterDelay(updateMatriculationPlan, selectedSubjects);
    setMatriculationPlan(updateMatriculationPlan);
  };

  /**
   * Handles matriculation subjects change.
   *
   * @param selectSubjects Selected subjects
   */
  const handleMatriculationSubjectsChange = React.useCallback(
    (selectSubjects: SelectedMatriculationSubject[]) => {
      savePlanAfterDelay(matriculationPlan, selectSubjects);
    },
    [matriculationPlan, savePlanAfterDelay]
  );

  if (hops.hopsMatriculationStatus !== "READY" || matriculationPlan === null) {
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
            <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
              <div className="application-sub-panel__item-title">
                {t("content.matriculationPlanTarget", { ns: "hops_new" })}
              </div>
              <div className="application-sub-panel__item-data">
                <div className="form-element form-element">
                  <input
                    id={"goalMatriculationExam"}
                    type="checkbox"
                    checked={matriculationPlan.goalMatriculationExam}
                    onChange={handleCheckboxChange}
                    disabled={useCase === "GUARDIAN"}
                  />
                </div>
              </div>
            </div>

            <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
              <div className="application-sub-panel__item-title">
                {t("content.matriculationPlanSubjectGoal", { ns: "hops_new" })}
              </div>
              <div className="application-sub-panel__item-data">
                <MatriculationSubjectsList
                  disabled={useCase === "GUARDIAN"}
                  subjects={hops.hopsMatriculation.subjects}
                  selectedSubjects={selectedSubjects}
                  onSubjectsChange={handleMatriculationSubjectsChange}
                />
              </div>
            </div>
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
        <ApplicationSubPanel>
          <ApplicationSubPanel.Body>
            <div className="application-sub-panel__notification-item">
              <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
                {t("content.matriculationPlanGuides1", { ns: "hops_new" })}
              </div>
            </div>

            <ItemList>
              <ItemList.Item>
                {t("content.matriculationPlanGuideSubject1", {
                  ns: "hops_new",
                })}
              </ItemList.Item>
              <ItemList.Item>
                {t("content.matriculationPlanGuideSubject2", {
                  ns: "hops_new",
                })}
              </ItemList.Item>
              <ItemList.Item>
                {t("content.matriculationPlanGuideSubject3", {
                  ns: "hops_new",
                })}
              </ItemList.Item>
              <ItemList.Item>
                {t("content.matriculationPlanGuideSubject4", {
                  ns: "hops_new",
                })}
              </ItemList.Item>
            </ItemList>

            <div className="application-sub-panel__notification-item">
              <div
                className="application-sub-panel__notification-body application-sub-panel__notification-body"
                dangerouslySetInnerHTML={{
                  __html: t("content.matriculationPlanGuides2", {
                    ns: "hops_new",
                  }),
                }}
              />
            </div>

            <div className="application-sub-panel__notification-item">
              <div
                className="application-sub-panel__notification-body application-sub-panel__notification-body"
                dangerouslySetInnerHTML={{
                  __html: t("content.matriculationPlanGuides3", {
                    ns: "hops_new",
                  }),
                }}
              />
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
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ saveMatriculationPlan }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MatriculationPlan);
