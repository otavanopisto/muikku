/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { useSelector } from "react-redux";
import { SMOWL_ENTITY_NAME, SMOWL_LICENSE_KEY } from "~/api_smowl/const";
import { generateMonitoringLink } from "~/api_smowl/helper";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";

/**
 * SMOWL monitoring status
 */
export type SmowlMonitoringStatus = "OK" | "NOTOK" | "PENDING" | null;

/**
 * UseSmowlMonitoringStatusProps
 */
interface UseSmowlMonitoringStatusProps {
  examId: number;
  isSmowlActivity: boolean;
}

/**
 * Hook to listen for SMOWL monitoring status messages
 * @param props - The properties for the hook
 * @returns The current monitoring status
 */
export const useSmowlMonitoringStatus = (
  props: UseSmowlMonitoringStatusProps
) => {
  const { examId, isSmowlActivity } = props;

  const { status, workspaces } = useSelector((state: StateType) => state);

  const [monitoringStatus, setMonitoringStatus] =
    React.useState<SmowlMonitoringStatus>(isSmowlActivity ? "PENDING" : null);

  const [monitoringLink, setMonitoringLink] = React.useState<{
    link: string | null;
    loading: boolean;
    error: Error | null;
  }>({
    link: null,
    loading: false,
    error: null,
  });

  React.useEffect(() => {
    if (!isSmowlActivity) {
      setMonitoringStatus(null);
      return;
    }

    /**
     * Handle SMOWL monitoring status messages
     * @param e - Message event
     */
    const handleMessage = (e: MessageEvent | any) => {
      const message = e.data || e.message;

      if (message === "monitoringstatusOK") {
        setMonitoringStatus("OK");
      } else if (message === "monitoringstatusNOTOK") {
        setMonitoringStatus("NOTOK");
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isSmowlActivity]);

  React.useEffect(() => {
    if (!isSmowlActivity || !examId || !workspaces.currentWorkspace) {
      setMonitoringLink({
        link: null,
        loading: false,
        error: null,
      });
      return;
    }

    /**
     * generateLink
     */
    const generateLink = async () => {
      try {
        setMonitoringLink({
          link: null,
          loading: true,
          error: null,
        });

        const monitoringLink = await generateMonitoringLink(
          {
            entityKey: SMOWL_LICENSE_KEY,
            userId: status.userId.toString(),
            activityType: "exam",
            activityId: examId.toString(),
            activityContainerId: workspaces.currentWorkspace.id.toString(),
            isMonitoring: 0,
          },
          {
            entityName: SMOWL_ENTITY_NAME,
            userName: status.profile.loggedUserName,
            userEmail: status.profile.emails[0],
            lang: localize.lang,
            type: 0,
          }
        );

        setMonitoringLink({
          link: monitoringLink,
          loading: false,
          error: null,
        });
      } catch (err) {
        setMonitoringLink({
          link: null,
          loading: false,
          error: err instanceof Error ? err : new Error(String(err)),
        });
      }
    };

    generateLink();
  }, [
    isSmowlActivity,
    status.userId,
    status.profile.loggedUserName,
    status.profile.emails,
    workspaces.currentWorkspace,
    examId,
  ]);

  return {
    monitoringStatus,
    monitoringLink,
  };
};
