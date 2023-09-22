import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { AssignmentsTabType } from "../assignments-and-diaries";
import { MaterialContentNode } from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * UseFollowUpGoalsState
 */
export interface UseAssignmentsState {
  isLoading: boolean;
  evaluatedAssignments: MaterialContentNode[];
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
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useEvaluatedAssignments = (
  workspaceId: number,
  tabOpen: AssignmentsTabType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [evaluatedAssignmentsData, setEvaluatedAssignmentsData] =
    React.useState(initialState);

  const { t } = useTranslation(["studies", "common"]);

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
            const assignments = <Array<MaterialContentNode>>await promisify(
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
          setEvaluatedAssignmentsData((evaluatedAssignmentsData) => ({
            ...evaluatedAssignmentsData,
            evaluatedAssignments: materials,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          displayNotification(
            `${t("notifications.loadError", {
              ns: "studies",
              context: "workspaceAssignments",
            })}, ${err.message}`,
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
    t,
  ]);

  return {
    evaluatedAssignmentsData,
  };
};
