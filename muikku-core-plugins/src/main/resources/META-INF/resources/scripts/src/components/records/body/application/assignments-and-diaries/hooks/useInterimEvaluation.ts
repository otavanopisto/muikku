import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { AssignmentsTabType } from "../assignments-and-diaries";
import { MaterialAssignment, MaterialContentNode } from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * UseFollowUpGoalsState
 */
export interface UseInterimEvaluationState {
  isLoading: boolean;
  interimEvaluationAssignments: MaterialContentNode[];
}

/**
 * Intial state
 */
const initialState: UseInterimEvaluationState = {
  isLoading: false,
  interimEvaluationAssignments: [],
};

/**
 * Custom hook for student study hours
 *
 * @param workspaceId workspaceId
 * @param tabOpen tabOpen
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useInterimEvaluationAssigments = (
  workspaceId: number,
  tabOpen: AssignmentsTabType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const { t } = useTranslation(["studies", "common"]);

  const [
    interimEvaluationeAssignmentsData,
    setInterimEvaluationAssignmentsData,
  ] = React.useState(initialState);

  React.useEffect(() => {
    let isCancelled = false;

    /**
     * loadExercisenData
     * Loads student activity data
     * @param workspaceId of student
     */
    const loadInterimEvaluationData = async (workspaceId: number) => {
      if (!isCancelled) {
        setInterimEvaluationAssignmentsData(
          (interimEvaluationeAssignmentsData) => ({
            ...interimEvaluationeAssignmentsData,
            isLoading: true,
          })
        );
      }

      try {
        /**
         * Loaded and filtered student activity
         */
        const [materials] = await Promise.all([
          (async () => {
            const assignments = <Array<MaterialAssignment>>await promisify(
                mApi().workspace.workspaces.materials.read(workspaceId, {
                  assignmentType: "INTERIM_EVALUATION",
                }),
                "callback"
              )() || [];

            const [materials] = await Promise.all([
              Promise.all(
                assignments.map((assignment) =>
                  promisify(
                    mApi().materials.html.read(assignment.materialId),
                    "callback"
                  )().then((assignments: MaterialContentNode) => assignments)
                )
              ),
            ]);

            return materials.map(
              (material, index) => <MaterialContentNode>Object.assign(
                  material,
                  {
                    assignment: assignments[index],
                    path: assignments[index].path,
                  }
                )
            );
          })(),
        ]);

        if (!isCancelled) {
          setInterimEvaluationAssignmentsData(
            (interimEvaluationeAssignmentsData) => ({
              ...interimEvaluationeAssignmentsData,
              interimEvaluationAssignments: materials,
              isLoading: false,
            })
          );
        }
      } catch (err) {
        if (!isCancelled) {
          displayNotification(
            `${t("notifications.loadError", {
              ns: "studies",
              context: "workspaceInterim",
            })}, ${err.message}`,
            "error"
          );
          setInterimEvaluationAssignmentsData(
            (interimEvaluationeAssignmentsData) => ({
              ...interimEvaluationeAssignmentsData,
              isLoading: false,
            })
          );
        }
      }
    };

    /**
     * Execute loading data when tab is set to evaluations and there is no
     * existing data
     */
    if (
      tabOpen === "INTERIM_EVALUATION" &&
      interimEvaluationeAssignmentsData.interimEvaluationAssignments.length ===
        0
    ) {
      loadInterimEvaluationData(workspaceId);
    }

    return () => {
      isCancelled = true;
    };
  }, [
    workspaceId,
    displayNotification,
    tabOpen,
    interimEvaluationeAssignmentsData.interimEvaluationAssignments.length,
    t,
  ]);

  return {
    interimEvaluationeAssignmentsData,
  };
};
