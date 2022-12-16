import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  MaterialAssignmentType,
  MaterialContentNodeType,
} from "~/reducers/workspaces";
import { AssignmentsTabType } from "../assignments-and-diaries";
import { i18nType } from "~/reducers/base/i18nOLD";

/**
 * UseFollowUpGoalsState
 */
export interface UseAssignmentExcerciseState {
  isLoading: boolean;
  excerciseAssignments: MaterialContentNodeType[];
}

/**
 * Intial state
 */
const initialState: UseAssignmentExcerciseState = {
  isLoading: false,
  excerciseAssignments: [],
};

/**
 * Custom hook for student study hours
 *
 * @param workspaceId workspaceId
 * @param tabOpen tabOpen
 * @param i18nOLD i18nType
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useExcerciseAssignments = (
  workspaceId: number,
  tabOpen: AssignmentsTabType,
  i18nOLD: i18nType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [excerciseAssignmentsData, setExcerciseAssignmentsData] =
    React.useState(initialState);

  React.useEffect(() => {
    let isCancelled = false;

    /**
     * loadExcercisenData
     * Loads student activity data
     * @param workspaceId of student
     */
    const loadExcercisenData = async (workspaceId: number) => {
      if (!isCancelled) {
        setExcerciseAssignmentsData((excerciseAssignmentsData) => ({
          ...excerciseAssignmentsData,
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
          setExcerciseAssignmentsData((excerciseAssignmentsData) => ({
            ...excerciseAssignmentsData,
            excerciseAssignments: materials,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          displayNotification(
            `${i18nOLD.text.get(
              "plugin.records.errormessage.workspaceAssignmentsExcerciseLoadFailed"
            )}, ${err.message}`,
            "error"
          );
          setExcerciseAssignmentsData((excerciseAssignmentsData) => ({
            ...excerciseAssignmentsData,
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
      excerciseAssignmentsData.excerciseAssignments.length === 0
    ) {
      loadExcercisenData(workspaceId);
    }

    return () => {
      isCancelled = true;
    };
  }, [
    workspaceId,
    displayNotification,
    tabOpen,
    excerciseAssignmentsData.excerciseAssignments.length,
    i18nOLD,
  ]);

  return {
    excerciseAssignmentsData,
  };
};
