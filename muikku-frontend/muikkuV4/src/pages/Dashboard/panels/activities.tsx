// activities panel uses Panel component and uses userActivityLogsDataAtom as data source
import Panel from "~/src/components/Panel/Panel";
import { Empty } from "~/src/components/Empty/empty";
import { useTranslation } from "react-i18next";
import useTimelineEvents from "~/src/pages/Dashboard/hooks/use-timeline-events";
import { ActivityLogType } from "~/generated/client";
import styles from "./panels.module.css";
import { Box } from "@mantine/core";
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
import { ThemeIcon, Pagination, Menu } from "@mantine/core";
import { useState } from "react";

const activityLogTypes = Object.values(ActivityLogType);

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
export default function Activities() {
  const { events, filters, setFilters } = useTimelineEvents();
  const { t } = useTranslation("activityLogs");
  const [pageIndex, setPageIndex] = useState(1);

  const maxItems = 10;
  const page = Math.ceil(events.length / maxItems);
  const pageItems = events.slice(
    (pageIndex - 1) * maxItems,
    pageIndex * maxItems
  );

  const dropdownActions = (
    <Menu.CheckboxGroup
      value={filters}
      onChange={(value) =>
        setFilters(
          value.filter((type): type is ActivityLogType =>
            activityLogTypes.includes(type as ActivityLogType)
          )
        )
      }
    >
      {activityLogTypes.map((type) => (
        <Menu.CheckboxItem key={type} value={type}>
          {t(`types.${type}`)}
        </Menu.CheckboxItem>
      ))}
    </Menu.CheckboxGroup>
  );

  return (
    <Panel panelDropdownActions={dropdownActions} title={t("label")}>
      {events.length === 0 ? (
        <Empty title={t("labels.empty")} description={t("content.empty")} />
      ) : (
        <>
          <Panel.Timeline
            items={pageItems.map((event) => ({
              title: event.title,
              subtitle: event.subtitle,
              bullet: getBulletByEntryType(event.type),
              alternate: event.alternate,
              opposite: event.opposite,
              type: event.type,
              timestamp: event.timestamp,
            }))}
          />
          <Box className={styles.timelineFooter}>
            <Pagination
              value={pageIndex}
              total={page}
              onChange={setPageIndex}
            />
          </Box>
        </>
      )}
    </Panel>
  );
}
