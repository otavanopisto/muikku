import { WorkspaceActivity } from "~/generated/client";

/**
 * RecordWorkspaceByLineCategory
 */
export interface RecordWorkspaceActivitiesWithLineCategory {
  lineCategory: string;
  credits: RecordWorkspaceActivityByLine[];
  transferCredits: RecordWorkspaceActivityByLine[];
  showCredits: boolean;
  completedCourseCredits: number;
  mandatoryCourseCredits: number;
}

/**
 * Record workspace activity with line name
 */
export interface RecordWorkspaceActivityByLine {
  lineName: string;
  activity: WorkspaceActivity;
}
