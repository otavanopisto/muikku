import { ActivityLogEntry } from "~/generated/client";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { MainChartData } from "./types";

/**
 * Processes the activity logs and workspace data into a format suitable for the chart.
 * @param {ActivityLogEntry[]} activityLogs - Array of activity log entries
 * @param {WorkspaceDataType[]} workspaces - Array of workspace data
 * @param {number[]} visibleWorkspaceIds - Array of visible workspace IDs
 * @returns {MainChartData[]} Processed chart data
 */
export const processChartData = (
  activityLogs: ActivityLogEntry[],
  workspaces: WorkspaceDataType[],
  visibleWorkspaceIds: number[]
) => {
  const chartDataMap = new Map<string, MainChartData>();
  if (activityLogs) {
    activityLogs.forEach((log) => {
      const date = log.timestamp.toISOString().slice(0, 10);
      const entry = chartDataMap.get(date) || {};
      switch (log.type) {
        case "SESSION_LOGGEDIN":
          entry.SESSION_LOGGEDIN = (entry.SESSION_LOGGEDIN || 0) + 1;
          break;
        case "FORUM_NEWMESSAGE":
        case "FORUM_NEWTHREAD":
          entry.FORUM_NEWMESSAGE = (entry.FORUM_NEWMESSAGE || 0) + 1;
          break;
        // Add other cases as needed
      }
      chartDataMap.set(date, entry);
    });
  }

  if (workspaces) {
    workspaces.forEach((workspace) => {
      if (visibleWorkspaceIds.includes(workspace.id)) {
        workspace.activityLogs.forEach((log) => {
          const date = log.timestamp.toISOString().slice(0, 10);
          const entry = chartDataMap.get(date) || {};
          switch (log.type) {
            case "EVALUATION_REQUESTED":
              entry.EVALUATION_REQUESTED =
                (entry.EVALUATION_REQUESTED || 0) + 1;
              break;
            case "EVALUATION_GOTINCOMPLETED":
              entry.EVALUATION_GOTINCOMPLETED =
                (entry.EVALUATION_GOTINCOMPLETED || 0) + 1;
              break;
            case "EVALUATION_GOTFAILED":
              entry.EVALUATION_GOTFAILED =
                (entry.EVALUATION_GOTFAILED || 0) + 1;
              break;
            case "EVALUATION_GOTPASSED":
              entry.EVALUATION_GOTPASSED =
                (entry.EVALUATION_GOTPASSED || 0) + 1;
              break;
            case "WORKSPACE_VISIT":
              entry.WORKSPACE_VISIT = (entry.WORKSPACE_VISIT || 0) + 1;
              break;
            case "MATERIAL_EXERCISEDONE":
              entry.MATERIAL_EXERCISEDONE =
                (entry.MATERIAL_EXERCISEDONE || 0) + 1;
              break;
            case "MATERIAL_ASSIGNMENTDONE":
              entry.MATERIAL_ASSIGNMENTDONE =
                (entry.MATERIAL_ASSIGNMENTDONE || 0) + 1;
              break;
          }
          chartDataMap.set(date, entry);
        });
      }
    });
  }

  const chartData = Array.from(chartDataMap, ([date, values]) => ({
    date,
    ...values,
  })).sort((a, b) => a.date.localeCompare(b.date));

  return chartData;
};
