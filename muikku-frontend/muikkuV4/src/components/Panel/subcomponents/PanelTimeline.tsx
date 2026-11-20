import { Timeline } from "@mantine/core";
import { localize } from "~/src/locales/i18n";
import styles from "./subcomponents.module.css";
export type PanelTimelineItem = {
  title: React.ReactNode;
  type: string;
  timestamp: Date;
  bullet?: React.ReactNode;
  alternate?: boolean;
  opposite?: React.ReactNode;
  subtitle?: React.ReactNode;
};

/**
 * Panel timeline props
 * @param items - Panel timeline items
 */
interface PanelTimelineProps {
  items: PanelTimelineItem[];
}

// Used elsewhere too, needs to be in utils
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
    <Timeline className={styles.timeline}>
      {items.map((item, index) => {
        const nextItem = items[index + 1];
        const activeProps = {
          active: isToday(item.timestamp),
          lineActive: nextItem !== undefined && isToday(nextItem.timestamp),
        };

        return (
          <Timeline.Item
            key={`${item.type}-${item.timestamp.toISOString()}-${String(item.alternate)}`}
            title={item.title}
            bullet={item.bullet}
            alternate={item.alternate}
            opposite={item.opposite}
            {...activeProps}
          >
            {item.subtitle}
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
