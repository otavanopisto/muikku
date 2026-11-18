import { Text, Timeline } from "@mantine/core";
import { localize } from "~/src/locales/i18n";

type PanelTimelineItem = {
  label: string;
  type: string;
  timestamp: Date;
  bullet?: React.ReactNode;
};

/**
 * Panel timeline props
 * @param items - Panel timeline items
 */
interface PanelTimelineProps {
  items: PanelTimelineItem[];
}

const isToday = (timestamp: Date) =>
  localize
    .getLocalizedDayjs(timestamp)
    .isSame(localize.getLocalizedDayjs(), "day");

/**
 * Panel timeline component
 * @param props - PanelTimelineProps
 * @returns - PanelTimeline component
 */
export function PanelTimeline(props: PanelTimelineProps) {
  const { items } = props;

  return (
    <Timeline>
      {items.map((item, index) => {
        const nextItem = items[index + 1];
        const activeProps = {
          active: isToday(item.timestamp),
          lineActive: nextItem !== undefined && isToday(nextItem.timestamp),
        };

        return (
          <Timeline.Item
            key={`${item.type}-${item.timestamp.toISOString()}`}
            title={item.label}
            bullet={item.bullet}
            {...activeProps}
          >
            <Text>{localize.date(item.timestamp, "DD.MM.YYYY HH:mm")}</Text>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
