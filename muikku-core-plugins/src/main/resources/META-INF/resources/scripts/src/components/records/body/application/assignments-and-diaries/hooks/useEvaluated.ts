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
export interface UseAssignmentsState {
  isLoading: boolean;
  evaluatedAssignments: MaterialContentNodeType[];
}

/**
 * Intial state
 */
const initialState: UseAssignmentsState = {
  isLoading: false,
  evaluatedAssignments: [],
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
export const useEvaluatedAssignments = (
  workspaceId: number,
  tabOpen: AssignmentsTabType,
  i18n: i18nType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [evaluatedAssignmentsData, setEvaluatedAssignmentsData] =
    React.useState(initialState);

  React.useEffect(() => {
    let isCancelled = false;

    /**
     * loadStudentActivityListData
     * Loads student activity data
     * @param workspaceId of student
     */
    const loadEvaluatedData = async (workspaceId: number) => {
      if (!isCancelled) {
        setEvaluatedAssignmentsData((evaluatedAssignmentsData) => ({
          ...evaluatedAssignmentsData,
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
                  assignmentType: "EVALUATED",
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
          setEvaluatedAssignmentsData((evaluatedAssignmentsData) => ({
            ...evaluatedAssignmentsData,
            evaluatedAssignments: materials,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          displayNotification(
            `${i18n.text.get(
              "plugin.records.errormessage.workspaceAssignmentsEvaluatedLoadFailed"
            )}, ${err.message}`,
            "error"
          );
          setEvaluatedAssignmentsData((evaluatedAssignmentsData) => ({
            ...evaluatedAssignmentsData,
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
      tabOpen === "EVALUATED" &&
      evaluatedAssignmentsData.evaluatedAssignments.length === 0
    ) {
      loadEvaluatedData(workspaceId);
    }

    return () => {
      isCancelled = true;
    };
  }, [
    workspaceId,
    displayNotification,
    tabOpen,
    evaluatedAssignmentsData.evaluatedAssignments.length,
    i18n,
  ]);

  return {
    evaluatedAssignmentsData,
  };
};
