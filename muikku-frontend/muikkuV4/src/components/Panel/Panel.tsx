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
} from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import styles from "./Panel.module.css";

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
    <Paper className={styles.panel} bg="panels" withBorder shadow="sm">
      <Box p="md" className={styles.panelHeader}>
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
      <Box p="md">{children}</Box>
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

export type PanelItemVariant = "important" | "warning" | "success";

export type PanelItemState = {
  label: string;
  state: PanelItemVariant;
};
/**
 * PanelItem component
 */
interface PanelItemProps {
  title: string;
  date: string | React.ReactNode;
  itemId: number;
  variant?: "important" | "warning" | "success";
  unseen?: boolean;
  itemActions?: PanelMenuItem[];
  icons?: React.ReactNode;
  states?: PanelItemState | PanelItemState[];
}

/**
 * Workspaces
 * @returns
 */
function PanelItem(props: PanelItemProps) {
  const { title, date, itemId, unseen, itemActions, states, icons, variant } =
    props;
  const titleColor =
    unseen === undefined
      ? "panelTitleText"
      : unseen
        ? "panelTitleText"
        : "panelSeenTitleText";
  const textColor =
    unseen === undefined
      ? "panelContentText"
      : unseen
        ? "panelContentText"
        : "panelSeenContentText";

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
    <Box key={itemId} mt="md">
      <Title c={titleColor} order={4} className={styles.panelItemTitle}>
        <Box className={styles.panelItemTitleContent}>
          {icons}
          {title}
        </Box>
        {itemActions && <Group>{actions}</Group>}
      </Title>
      {states && (
        <Box bg={variant} className={styles.panelItemVariant}>
          {Array.isArray(states) ? (
            states.map((state) => (
              <Badge
                tt="none"
                key={state.label + state.state}
                variant="outline
                "
                color={state.state}
              >
                {state.label}
              </Badge>
            ))
          ) : (
            <Badge tt="none" variant="outline" color={states.state}>
              {states.label}
            </Badge>
          )}
        </Box>
      )}
      <Text c={textColor}>{date}</Text>
    </Box>
  );
}

Panel.Item = PanelItem;
