import React from "react";
import { ActivityLogEntry } from "~/generated/client";
import { WorkspaceDataType } from "~/reducers/workspaces";
import MainChart from "./main-chart";

interface CurrentStudentStatisticsProps {
  activityLogs?: Array<ActivityLogEntry>;
  workspaces?: WorkspaceDataType[];
}

const CurrentStudentStatistics = (props: CurrentStudentStatisticsProps) => (
  <div className="application-sub-panel__body">
    <MainChart
      workspaces={props.workspaces}
      activityLogs={props.activityLogs}
    />
  </div>
);

export default CurrentStudentStatistics;
