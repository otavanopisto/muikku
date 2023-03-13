import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  MaterialAssignmentType,
  MaterialContentNodeType,
} from "~/reducers/workspaces";
import { AssignmentsTabType } from "../assignments-and-diaries";
import { i18nType } from "~/reducers/base/i18n";

/**
 * UseFollowUpGoalsState
 */
export interface UseAssignmentExerciseState {
  isLoading: boolean;
  exerciseAssignments: MaterialContentNodeType[];
}

/**
 * Intial state
 */
const initialState: UseAssignmentExerciseState = {
  isLoading: false,
  exerciseAssignments: [],
};

/**
 * Custom hook for student study hours
 *
 * @param workspaceId workspaceId
 * @param tabOpen tabOpen
 * @param i18n i18nType
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useExerciseAssignments = (
  workspaceId: number,
  tabOpen: AssignmentsTabType,
  i18n: i18nType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [exerciseAssignmentsData, setExerciseAssignmentsData] =
    React.useState(initialState);

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
            const assignments = <Array<MaterialAssignmentType>>await promisify(
                mApi().workspace.workspaces.materials.read(workspaceId, {
                  assignmentType: "EXERCISE",
                }),
                "callback"
              )() || [];

            const [materials] = await Promise.all([
              Promise.all(
                assignments.map((assignment) =>
                  promisify(
                    mApi().materials.html.read(assignment.materialId),
                    "callback"
                  )().then(
                    (assignments: MaterialContentNodeType) => assignments
                  )
                )
              ),
            ]);

            return materials.map(
              (material, index) => <MaterialContentNodeType>Object.assign(
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
            `${i18n.text.get(
              "plugin.records.errormessage.workspaceAssignmentsExerciseLoadFailed"
            )}, ${err.message}`,
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
    i18n,
  ]);

  return {
    exerciseAssignmentsData,
  };
};
