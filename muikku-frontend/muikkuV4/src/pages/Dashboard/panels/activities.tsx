// activities panel uses Panel component and uses userActivityLogsDataAtom as data source
import Panel from "~/src/components/Panel/Panel";
import { userActivityLogsDataAtom } from "~/src/atoms/activitylogs";
import { useAtomValue } from "jotai";
import { Empty } from "src/components/Empty";
import type { DatedActivityLogHash } from "~/src/atoms/activitylogs";
import { useTranslation } from "react-i18next";
import { ActivityLogType } from "~/generated/client";
import {
  IconBell,
  IconCalendarTime,
  IconChecklist,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconDoorEnter,
  IconFileCheck,
  IconLogin,
  IconMessageCircle,
  IconMessages,
  IconPencil,
  IconSchool,
  IconSend,
  IconSendOff,
  IconUserExclamation,
} from "@tabler/icons-react";
import { ThemeIcon, Pagination } from "@mantine/core";
import { useState } from "react";

const activityEntries = (logs: DatedActivityLogHash) =>
  Object.values(logs)
    .flat()
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

const getBulletByEntryType = (type: ActivityLogType) => {
  switch (type) {
    case ActivityLogType.EvaluationRequested:
      return (
        <ThemeIcon color="warning" size="22">
          <IconSend size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.EvaluationGotincompleted:
      return (
        <ThemeIcon color="warning" size="22">
          <IconPencil size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.EvaluationGotfailed:
      return (
        <ThemeIcon color="error" size="22">
          <IconCircleX size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.EvaluationGotpassed:
      return (
        <ThemeIcon color="success" size="22">
          <IconCircleCheck size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.EvaluationRequestCancelled:
      return (
        <ThemeIcon color="aborted" size="22">
          <IconSendOff size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.SessionLoggedin:
      return (
        <ThemeIcon color="info" size="22">
          <IconLogin size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.WorkspaceVisit:
      return (
        <ThemeIcon color="info" size="22">
          <IconDoorEnter size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.MaterialExercisedone:
      return (
        <ThemeIcon color="success" size="22">
          <IconChecklist size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.MaterialAssignmentdone:
      return (
        <ThemeIcon color="success" size="22">
          <IconFileCheck size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.ForumNewmessage:
      return (
        <ThemeIcon color="info" size="22">
          <IconMessageCircle size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.ForumNewthread:
      return (
        <ThemeIcon color="info" size="22">
          <IconMessages size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.NotificationAssesmentrequest:
      return (
        <ThemeIcon color="warning" size="22">
          <IconBell size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.NotificationNopassedcourses:
      return (
        <ThemeIcon color="warning" size="22">
          <IconSchool size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.NotificationSupplementationrequest:
      return (
        <ThemeIcon color="warning" size="22">
          <IconPencil size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.NotificationStudytime:
      return (
        <ThemeIcon color="warning" size="22">
          <IconCalendarTime size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.NotificationNeverloggedin:
      return (
        <ThemeIcon color="error" size="22">
          <IconUserExclamation size={12} />
        </ThemeIcon>
      );
    case ActivityLogType.NotificationNologgedinfortwomonths:
      return (
        <ThemeIcon color="warning" size="22">
          <IconClock size={12} />
        </ThemeIcon>
      );
    default: {
      const unhandled: never = type;
      return unhandled;
    }
  }
};

/**
 * Dashboard activity log list
 * @returns Activity panel
 */
export function Activities() {
  const activities = useAtomValue(userActivityLogsDataAtom);
  const { t } = useTranslation("activityLogs");
  const [pageIndex, setPageIndex] = useState(1);

  if (activities === undefined) {
    return <Empty title="No activities found" />;
  }

  const entries = activityEntries(activities);

  if (entries.length === 0) {
    return <Empty title="No activities found" />;
  }
  const maxItems = 10;
  const entrycount = entries.length;
  const page = Math.ceil(entrycount / maxItems);
  const pageItems = entries.slice(
    (pageIndex - 1) * maxItems,
    pageIndex * maxItems
  );

  return (
    <Panel title={t("label")}>
      <Panel.Timeline
        items={pageItems.map((entry) => ({
          label: t(`types.${entry.type}`),
          bullet: getBulletByEntryType(entry.type),
          type: entry.type,
          timestamp: entry.timestamp,
        }))}
      />
      <Pagination value={pageIndex} total={page} onChange={setPageIndex} />
    </Panel>
  );
}

export default Activities;
