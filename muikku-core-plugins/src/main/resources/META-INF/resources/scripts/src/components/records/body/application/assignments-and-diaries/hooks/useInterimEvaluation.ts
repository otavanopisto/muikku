import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { AssignmentsTabType } from "../assignments-and-diaries";
import { MaterialContentNode } from "~/generated/client";
import { useTranslation } from "react-i18next";
import MApi from "~/api/api";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces";

/**
 * UseFollowUpGoalsState
 */
export interface UseInterimEvaluationState {
  isLoading: boolean;
  interimEvaluationAssignments: MaterialContentNodeWithIdAndLogic[];
}

/**
 * Intial state
 */
const initialState: UseInterimEvaluationState = {
  isLoading: false,
  interimEvaluationAssignments: [],
};

const materialsApi = MApi.getMaterialsApi();
const workspaceApi = MApi.getWorkspaceApi();

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
            const assignments = await workspaceApi.getWorkspaceMaterials({
              workspaceEntityId: workspaceId,
              assignmentType: "INTERIM_EVALUATION",
            });

            const [materials] = await Promise.all([
              Promise.all(
                assignments.map((assignment) =>
                  materialsApi.getHtmlMaterial({
                    id: assignment.materialId,
                  })
                )
              ),
            ]);

            return materials.map(
              (material, index) =>
                <MaterialContentNodeWithIdAndLogic>Object.assign(material, {
                  assignment: assignments[index],
                  path: assignments[index].path,
                })
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
