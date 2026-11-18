import {
  Paper,
  Title,
  Box,
  ThemeIcon,
  ColorSwatch,
  Tooltip,
} from "@mantine/core";
import styles from "./Panel.module.css";
import { PanelAccordionItem } from "./subcomponents/PanelAccordionItem";
import { PanelItem } from "./subcomponents/PanelItem";
import { PanelTimeline } from "./subcomponents/PanelTimeline";

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
      <Box className={styles.header}>
        <Box className={styles.title}>
          {icon && (
            <ThemeIcon className={styles.icon} variant="filled" size="lg">
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

Panel.Item = PanelItem;
Panel.AccordionItem = PanelAccordionItem;
Panel.Timeline = PanelTimeline;
