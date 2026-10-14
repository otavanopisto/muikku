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

/**
 * PanelItem component
 */
interface PanelItemProps {
  title: string;
  date: string;
  itemId: number;
  unseen?: boolean;
  itemActions?: PanelMenuItem[];
}

/**
 * Workspaces
 * @returns
 */
function PanelItem(props: PanelItemProps) {
  const { unseen, title, date, itemActions, itemId } = props;
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
    <Menu position="bottom-end" closeOnItemClick={false}>
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
      <Title c={titleColor} order={3} className={styles.panelItemTitle}>
        {title} {itemActions && <Group>{actions}</Group>}
      </Title>
      <Text c={textColor}>{date}</Text>
    </Box>
  );
}

Panel.Item = PanelItem;
