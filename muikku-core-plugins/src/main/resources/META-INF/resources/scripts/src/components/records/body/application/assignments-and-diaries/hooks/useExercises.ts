import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { AssignmentsTabType } from "../assignments-and-diaries";
import { MaterialContentNode } from "~/generated/client";
import { useTranslation } from "react-i18next";
import MApi from "~/api/api";

/**
 * UseFollowUpGoalsState
 */
export interface UseAssignmentExerciseState {
  isLoading: boolean;
  exerciseAssignments: MaterialContentNode[];
}

/**
 * Intial state
 */
const initialState: UseAssignmentExerciseState = {
  isLoading: false,
  exerciseAssignments: [],
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
export const useExerciseAssignments = (
  workspaceId: number,
  tabOpen: AssignmentsTabType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [exerciseAssignmentsData, setExerciseAssignmentsData] =
    React.useState(initialState);
  const { t } = useTranslation("studies");
  React.useEffect(() => {
    let isCancelled = false;

    /**
     * loadExercisenData
     * Loads student activity data
     * @param workspaceId of student
     */
    const loadExercisenData = async (workspaceId: number) => {
      if (!isCancelled) {
        setExerciseAssignmentsData((exerciseAssignmentsData) => ({
          ...exerciseAssignmentsData,
          isLoading: true,
        }));
      }

      try {
        /**
         * Loaded and filtered student activity
         */
        const [materials] = await Promise.all([
          (async () => {
            const assignments = await workspaceApi.getWorkspaceMaterials({
              workspaceEntityId: workspaceId,
              assignmentType: "EXERCISE",
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
          setExerciseAssignmentsData((exerciseAssignmentsData) => ({
            ...exerciseAssignmentsData,
            exerciseAssignments: materials,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          displayNotification(
            `${t("notifications.loadError", {
              context: "workspaceAssignments",
            })}, ${err.message}`,
            "error"
          );
          setExerciseAssignmentsData((exerciseAssignmentsData) => ({
            ...exerciseAssignmentsData,
            isLoading: false,
          }));
        }
      }
    };

    /**
     * Execute loading data when tab is set to evaluations and there is no
     * existing data
     */
    if (
      tabOpen === "EXERCISE" &&
      exerciseAssignmentsData.exerciseAssignments.length === 0
    ) {
      loadExercisenData(workspaceId);
    }

    return () => {
      isCancelled = true;
    };
  }, [
    workspaceId,
    displayNotification,
    tabOpen,
    exerciseAssignmentsData.exerciseAssignments.length,
    t,
  ]);

  return {
    exerciseAssignmentsData,
  };
};
