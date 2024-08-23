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
} from "./components/matriculation-subjects-listV2";
import {
  SaveMatriculationPlanTriggerType,
  saveMatriculationPlan,
} from "../../../../../actions/main-function/hops/index";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { MatriculationSubjectCode } from "./components/matriculation-subject-type";
import ItemList from "~/components/general/item-list";

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

  const { t } = useTranslation(["hops", "guider", "common"]);

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
        term: `${subject.term}${subject.year}`,
      })
    );
  }, [plan]);

  // Memoized selectable subjects
  const selectableSubjects = React.useMemo(() => {
    if (!hops.hopsMatriculation || !hops.hopsMatriculation.subjects) return [];

    return hops.hopsMatriculation.subjects.map(
      (s) => s.code as MatriculationSubjectCode
    );
  }, [hops.hopsMatriculation]);

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
      <ApplicationSubPanel.Header>YO - suunnitelma</ApplicationSubPanel.Header>
      <ApplicationSubPanel modifier="matriculation-plan-content">
        <ApplicationSubPanel modifier="matriculation-plan-data">
          <ApplicationSubPanel.Body>
            <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
              <div className="application-sub-panel__item-title">
                {t("content.targetMatriculationExam", { ns: "hops" })}
              </div>
              <div className="application-sub-panel__item-data">
                <div className="form-element form-element">
                  <input
                    id={"goalMatriculationExam"}
                    type="checkbox"
                    checked={matriculationPlan.goalMatriculationExam}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>

            <div className="application-sub-panel__item application-sub-panel__item--hops-editable">
              <div className="application-sub-panel__item-title">
                {t("content.matriculationSubjectsGoal", { ns: "hops" })}
              </div>
              <div className="application-sub-panel__item-data">
                <MatriculationSubjectsList
                  subjects={selectableSubjects}
                  selectedSubjects={selectedSubjects}
                  onSubjectsChange={handleMatriculationSubjectsChange}
                />
              </div>
            </div>
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
        <ApplicationSubPanel>
          <ApplicationSubPanel.Body>
            <p>
              Äidinkieli tai S2 + vähintään neljä koetta, jotka valitaan
              vähintään kolmesta aineryhmästä:
            </p>

            <ItemList>
              <ItemList.Item icon="icon-check">
                Äidinkieli (tai S2)
              </ItemList.Item>
              <ItemList.Item icon="icon-check">
                Vieras kieli (pitkä tai lyhyt)
              </ItemList.Item>
              <ItemList.Item icon="icon-check">
                Matematiikka (pitkä tai lyhyt)
              </ItemList.Item>
              <ItemList.Item icon="icon-check">
                Toinen kotimainen kieli eli ruotsi (pitkä tai keskipitkä)
              </ItemList.Item>
              <ItemList.Item icon="icon-check">
                Yksi reaaliaineen koe
              </ItemList.Item>
            </ItemList>
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
