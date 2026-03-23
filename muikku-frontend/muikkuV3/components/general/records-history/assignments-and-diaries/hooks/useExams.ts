import * as React from "react";
import { useTranslation } from "react-i18next";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { ExamAttendance } from "~/generated/client";

/**
 * UseFollowUpGoalsState
 */
export interface UseExamsState {
  isLoading: boolean;
  exams: ExamAttendance[];
}

/**
 * Intial state
 */
const initialState: UseExamsState = {
  isLoading: false,
  exams: [],
};

const examsApi = MApi.getExamApi();

/**
 * Custom hook for exams
 * @param workspaceId workspaceId
 * @param displayNotification displayNotification
 */
export const useExams = (
  workspaceId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [examsData, setExamsData] = React.useState(initialState);

  const { t } = useTranslation(["studies", "common"]);

  React.useEffect(() => {
    let isCancelled = false;

    /**
     * Loads exams data
     * @param workspaceId workspaceId
     */
    const loadExamsData = async (workspaceId: number) => {
      if (!isCancelled) {
        setExamsData((examsData) => ({ ...examsData, isLoading: true }));
      }

      try {
        const exams = await examsApi.getExamAttendances({
          workspaceEntityId: workspaceId,
        });

        if (!isCancelled) {
          setExamsData((examsData) => ({
            ...examsData,
            exams: exams,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          if (!isMApiError(err)) {
            throw err;
          }

          displayNotification(
            `${t("notifications.loadError", {
              ns: "studies",
              context: "workspaceJournal",
            })}, ${err.message}`,
            "error"
          );
          setExamsData((examsData) => ({
            ...examsData,
            isLoading: false,
          }));
        }
      }
    };

    loadExamsData(workspaceId);

    return () => {
      isCancelled = true;
    };
  }, [workspaceId, displayNotification, t]);

  return {
    examsData,
  };
};
