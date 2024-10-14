import { TFunction } from "i18next";
import { ActivityLogEntry } from "~/generated/client";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { MainChartData, SeriesConfig } from "./types";

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

/**
 * Creates the configuration for main chart series based on the provided translation function.
 * @param t - Translation function
 * @returns Array of SeriesConfig objects
 */
export const mainChartSeriesConfig = (t: TFunction): SeriesConfig[] => [
  {
    field: "SESSION_LOGGEDIN",
    name: t("labels.graph", { ns: "guider", context: "logins" }),
    color: "#2c2c2c",
    modifier: "logins",
    type: "line",
  },
  {
    field: "MATERIAL_ASSIGNMENTDONE",
    name: t("labels.graph", {
      ns: "guider",
      context: "assignments",
    }),
    color: "#ce01bd",
    modifier: "assignments",
    type: "column",
  },
  {
    field: "MATERIAL_EXERCISEDONE",
    name: t("labels.graph", {
      ns: "guider",
      context: "exercises",
    }),
    color: "#ff9900",
    modifier: "exercises",
    type: "column",
  },
  {
    field: "WORKSPACE_VISIT",
    name: t("labels.graph", {
      ns: "guider",
      context: "visits",
    }),
    color: "#43cd80",
    modifier: "visits",
    type: "line",
  },
  {
    field: "FORUM_NEWMESSAGE",
    name: t("labels.graph", {
      ns: "guider",
      context: "discussionMessages",
    }),
    color: "#62c3eb",
    modifier: "discussionMessages",
    type: "column",
  },
  {
    field: "EVALUATION_REQUESTED",
    name: t("labels.graph", {
      ns: "guider",
      context: "evaluationRequest",
    }),
    color: "#009fe3",
    modifier: "evaluationRequest",
    type: "line",
  },
  {
    field: "EVALUATION_GOTINCOMPLETED",
    name: t("labels.graph", {
      ns: "guider",
      context: "incomplete",
    }),
    color: "#ea7503",
    modifier: "incomplete",
    type: "line",
  },
  {
    field: "EVALUATION_GOTPASSED",
    name: t("labels.graph", {
      ns: "guider",
      context: "passed",
    }),
    color: "#24c118",
    modifier: "passed",
    type: "line",
  },
  {
    field: "EVALUATION_GOTFAILED",
    name: t("labels.graph", {
      ns: "guider",
      context: "failed",
    }),
    color: "#de3211",
    modifier: "failed",
    type: "line",
  },
];

/**
 * Creates the configuration for workspace chart series based on the provided translation function.
 * @param t - Translation function
 * @returns Array of SeriesConfig objects
 */
export const workspaceChartSeriesConfig = (t: TFunction): SeriesConfig[] => [
  {
    field: "MATERIAL_ASSIGNMENTDONE",
    name: t("labels.graph", {
      ns: "guider",
      context: "assignments",
    }),
    color: "#ce01bd",
    modifier: "assignments",
    type: "column",
  },
  {
    field: "MATERIAL_EXERCISEDONE",
    name: t("labels.graph", {
      ns: "guider",
      context: "exercises",
    }),
    color: "#ff9900",
    modifier: "exercises",
    type: "column",
  },
  {
    field: "WORKSPACE_VISIT",
    name: t("labels.graph", {
      ns: "guider",
      context: "visits",
    }),
    color: "#43cd80",
    modifier: "visits",
    type: "line",
  },
  {
    field: "EVALUATION_REQUESTED",
    name: t("labels.graph", {
      ns: "guider",
      context: "evaluationRequest",
    }),
    color: "#009fe3",
    modifier: "evaluationRequest",
    type: "line",
  },
  {
    field: "EVALUATION_GOTINCOMPLETED",
    name: t("labels.graph", {
      ns: "guider",
      context: "incomplete",
    }),
    color: "#ea7503",
    modifier: "incomplete",
    type: "line",
  },
  {
    field: "EVALUATION_GOTPASSED",
    name: t("labels.graph", {
      ns: "guider",
      context: "passed",
    }),
    color: "#24c118",
    modifier: "passed",
    type: "line",
  },
  {
    field: "EVALUATION_GOTFAILED",
    name: t("labels.graph", {
      ns: "guider",
      context: "failed",
    }),
    color: "#de3211",
    modifier: "failed",
    type: "line",
  },
];
