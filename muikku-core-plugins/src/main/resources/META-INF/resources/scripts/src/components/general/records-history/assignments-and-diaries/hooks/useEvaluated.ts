import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { AssignmentsTabType } from "../assignments-and-diaries";
import { useTranslation } from "react-i18next";
import MApi, { isMApiError } from "~/api/api";
import { MaterialContentNodeWithIdAndLogic } from "~/reducers/workspaces";

/**
 * UseFollowUpGoalsState
 */
export interface UseAssignmentsState {
  isLoading: boolean;
  evaluatedAssignments: MaterialContentNodeWithIdAndLogic[];
}

/**
 * Intial state
 */
const initialState: UseAssignmentsState = {
  isLoading: false,
  evaluatedAssignments: [],
};

const materialsApi = MApi.getMaterialsApi();
const workspaceApi = MApi.getWorkspaceApi();

/**
 * Custom hook for student study hours
 *
 * @param workspaceId workspaceId
 * @param userEntityId userEntityId
 * @param tabOpen tabOpen
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useEvaluatedAssignments = (
  workspaceId: number,
  userEntityId: number,
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
            const assignments = await workspaceApi.getWorkspaceMaterials({
              workspaceEntityId: workspaceId,
              assignmentType: "EVALUATED",
              userEntityId: userEntityId,
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
          setEvaluatedAssignmentsData((evaluatedAssignmentsData) => ({
            ...evaluatedAssignmentsData,
            evaluatedAssignments: materials,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          if (!isMApiError(err)) {
            throw err;
          }

          displayNotification(
            t("notifications.loadError", {
              ns: "studies",
              context: "workspaceAssignments",
              error: "err.message",
            }),
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
    userEntityId,
  ]);

  return {
    evaluatedAssignmentsData,
  };
};
