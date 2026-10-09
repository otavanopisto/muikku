import {
  Paper,
  Title,
  Box,
  ThemeIcon,
  ColorSwatch,
  Tooltip,
} from "@mantine/core";
import styles from "./Panel.module.css";

/**
 * A basic Panel component used mainly in the dashboard
 * Contains a title and children
 */
interface PanelProps {
  title: string;
  icon?: React.ReactNode;
  unreadCount?: number;
  children: React.ReactNode;
}

/**
 * @param props PanelProps
 * @returns Panel component
 */
export function Panel(props: PanelProps) {
  const { title, icon, unreadCount, children } = props;
  return (
    <Paper withBorder shadow="sm">
      <Box p="md" className={styles.panelTitle}>
        {icon && (
          <ThemeIcon variant="filled" mr="sm" size="lg">
            {icon}
          </ThemeIcon>
        )}
        <Title order={2}>{title}</Title>
        {unreadCount && unreadCount > 0 && (
          <Tooltip label="Unread count">
            <ColorSwatch color="red">{unreadCount}</ColorSwatch>
          </Tooltip>
        )}
      </Box>
      <Box p="md">{children}</Box>
    </Paper>
  );
}
