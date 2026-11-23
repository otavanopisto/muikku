import {
  Paper,
  Title,
  Box,
  Menu,
  ColorSwatch,
  Tooltip,
  ActionIcon,
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import styles from "./Panel.module.css";
import { PanelAccordionItem } from "./subcomponents/PanelAccordionItem";
import { PanelItem } from "./subcomponents/PanelItem";
import { PanelTimeline } from "./subcomponents/PanelTimeline";
import type { PanelMenuItem } from "./subcomponents/types";

export type {
  PanelItemBadge,
  PanelItemState,
  PanelItemVariant,
  PanelMenuItem,
} from "./subcomponents/types";

/**
 * A basic Panel component used mainly in the dashboard
 * Contains a title and children
 */
interface PanelProps {
  title: string;
  panelActions?: PanelMenuItem[];
  countIndicator?: number;
  indicatorTooltip?: string;
  children: React.ReactNode;
}

/**
 * @param props PanelProps
 * @returns Panel component
 */
export default function Panel(props: PanelProps) {
  const { title, countIndicator, indicatorTooltip, children, panelActions } =
    props;
  return (
    <Paper className={styles.panel}>
      <Box className={styles.header}>
        <Title order={2}>{title}</Title>
        {countIndicator !== undefined && countIndicator > 0 && (
          <Tooltip label={indicatorTooltip}>
            <ColorSwatch withShadow color="red">
              {countIndicator}
            </ColorSwatch>
          </Tooltip>
        )}
        {panelActions && (
          <Menu position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" aria-label="Dashboard actions">
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {panelActions.map((action) => (
                <Menu.Item onClick={() => action.action()} key={action.label}>
                  {action.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        )}
      </Box>
      <Box>{children}</Box>
    </Paper>
  );
}

Panel.Item = PanelItem;
Panel.AccordionItem = PanelAccordionItem;
Panel.Timeline = PanelTimeline;
