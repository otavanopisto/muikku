// activities panel uses Panel component and uses userActivityLogsDataAtom as data source
import Panel from "~/src/components/Panel/Panel";
import { userActivityLogsDataAtom } from "~/src/atoms/activitylogs";
import { useAtomValue } from "jotai";
import { Empty } from "src/components/Empty";
import type { DatedActivityLogHash } from "~/src/atoms/activitylogs";
import { useTranslation } from "react-i18next";

const activityEntries = (logs: DatedActivityLogHash) =>
  Object.values(logs)
    .flat()
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

/**
 * Dashboard activity log list
 * @returns Activity panel
 */
export function Activities() {
  const activities = useAtomValue(userActivityLogsDataAtom);
  const { t } = useTranslation("activities");
  if (activities === undefined) {
    return <Empty title="No activities found" />;
  }

  const entries = activityEntries(activities);
  if (entries.length === 0) {
    return <Empty title="No activities found" />;
  }

  return (
    <Panel title={t("label")}>
      <Panel.Timeline
        items={entries.map((entry) => ({
          type: t(`types.${entry.type}`),
          timestamp: entry.timestamp,
        }))}
      />
    </Panel>
  );
}

export default Activities;
