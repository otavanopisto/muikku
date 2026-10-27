import {
  Paper,
  Title,
  Text,
  Box,
  ThemeIcon,
  ColorSwatch,
  Tooltip,
  Menu,
  ActionIcon,
  Badge,
  Group,
  Accordion,
  Timeline,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import styles from "./Panel.module.css";
import { localize } from "~/src/locales/i18n";
/**
 * A basic Panel component used mainly in the dashboard
 * Contains a title and children
 */
interface PanelProps {
  title: string;
  icon?: React.ReactNode;
  countIndicator?: number;
  indicatorTooltip?: string;
  children: React.ReactNode;
}

/**
 * @param props PanelProps
 * @returns Panel component
 */
export default function Panel(props: PanelProps) {
  const { title, icon, countIndicator, indicatorTooltip, children } = props;
  return (
    <Paper className={styles.panel}>
      <Box pb="md" className={styles.panelHeader}>
        <Box className={styles.panelTitle}>
          {icon && (
            <ThemeIcon variant="filled" mr="sm" size="lg">
              {icon}
            </ThemeIcon>
          )}
          <Title order={2}>{title}</Title>
        </Box>
        {countIndicator !== undefined && countIndicator > 0 && (
          <Tooltip label={indicatorTooltip}>
            <ColorSwatch withShadow color="red">
              {countIndicator}
            </ColorSwatch>
          </Tooltip>
        )}
      </Box>
      <Box>{children}</Box>
    </Paper>
  );
}

/**
 * Menu item for the PanelItem component
 */
export interface PanelMenuItem {
  label: string;
  action: (announcementId: number) => void;
  icon?: React.ReactNode;
}

export type PanelItemVariant = "high" | "medium" | "low";
export type PanelItemState = "warning" | "success" | "info";

export type PanelItemBadge = {
  label: string;
  state: PanelItemState;
};

/**
 * Text color function for the PanelItem components
 * @param unseen - Whether the item is unseen
 * @returns - The text colors for the item
 */
function panelItemTextColors(unseen: boolean | undefined) {
  const seen = unseen === false;
  return {
    titleColor: seen ? "panelSeenTitleText" : "panelTitleText",
    textColor: seen ? "panelSeenContentText" : "panelContentText",
  } as const;
}

/**
 * Panel item header component
 * @param props - PanelItemHeaderProps
 * @returns - PanelItemHeader component
 */
interface PanelItemHeaderProps {
  title: string;
  unseen?: boolean;
  itemActions?: PanelMenuItem[];
  badges?: PanelItemBadge | PanelItemBadge[];
  icons?: React.ReactNode;
  itemId: number;
}

/**
 * Panel item header component
 * @param props - PanelItemHeaderProps
 * @returns - PanelItemHeader component
 */
function PanelItemHeader(props: PanelItemHeaderProps) {
  const { title, itemId, unseen, itemActions, badges, icons } = props;
  const actions = (
    <Menu position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="subtle" aria-label="Dashboard actions">
          <IconDotsVertical />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {itemActions?.map((action) => (
          <Menu.Item onClick={() => action.action(itemId)} key={action.label}>
            {action.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
  return (
    <>
      <Title
        c={panelItemTextColors(unseen).titleColor}
        order={4}
        className={styles.panelItemTitle}
      >
        <Box className={styles.panelItemTitleContent}>
          {icons}
          {title}
        </Box>
        {itemActions && <Group>{actions}</Group>}
      </Title>
      {badges && (
        <Box className={styles.panelItemVariant}>
          {Array.isArray(badges) ? (
            badges.map((badge) => (
              <Badge
                tt="none"
                key={badge.label + badge.state}
                variant="outline
            "
                color={badge.state}
              >
                {badge.label}
              </Badge>
            ))
          ) : (
            <Badge tt="none" variant="outline" color={badges.state}>
              {badges.label}
            </Badge>
          )}
        </Box>
      )}
    </>
  );
}

/**
 * PanelItem component
 */
interface PanelItemProps {
  title: string;
  date: string | React.ReactNode;
  itemId: number;
  variant?: PanelItemVariant;
  unseen?: boolean;
  itemActions?: PanelMenuItem[];
  icons?: React.ReactNode;
  badges?: PanelItemBadge | PanelItemBadge[];
  children?: React.ReactNode;
}

/**
 * Workspaces
 * @returns
 */
function PanelItem(props: PanelItemProps) {
  const {
    children,
    title,
    date,
    itemId,
    unseen,
    itemActions,
    badges,
    icons,
    variant,
  } = props;

  return (
    <Paper variant={variant ?? "panel-item"} p="sm" key={itemId} withBorder>
      <PanelItemHeader
        title={title}
        itemId={itemId}
        unseen={unseen}
        itemActions={itemActions}
        badges={badges}
        icons={icons}
      />
      {children && <Box>{children}</Box>}
      <Text c={panelItemTextColors(unseen).textColor}>{date}</Text>
    </Paper>
  );
}

/**
 * Panel item for accordion container
 * @param props - PanelItemProps
 * @returns - PanelAccordionItem component
 */
function PanelAccordionItem(props: PanelItemProps) {
  const { title, date, variant, itemId, unseen, badges, icons, children } =
    props;
  return (
    <Accordion.Item value={title}>
      <Paper variant={variant ?? "panel-item"} key={itemId} mb="md" withBorder>
        <Accordion.Control>
          <PanelItemHeader
            title={title}
            itemId={itemId}
            unseen={unseen}
            badges={badges}
            icons={icons}
          />
          <Text c={panelItemTextColors(unseen).textColor}>{date}</Text>
        </Accordion.Control>
        <Accordion.Panel>{children}</Accordion.Panel>
      </Paper>
    </Accordion.Item>
  );
}

type PanelTimelineItem = {
  type: string;
  timestamp: Date;
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
 * @param props - PanelItemProps
 * @returns - PanelTimeline component
 */
function PanelTimeline(props: PanelTimelineProps) {
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
            title={item.type}
            {...activeProps}
          >
            <Text>{localize.date(item.timestamp, "DD.MM.YYYY HH:mm")}</Text>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
Panel.Item = PanelItem;
Panel.AccordionItem = PanelAccordionItem;
Panel.Timeline = PanelTimeline;
