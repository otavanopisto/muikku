import { Box, Paper } from "@mantine/core";
import styles from "../Panel.module.css";
import { PanelItemHeader } from "./PanelItemHeader";
import { panelItemTextColors } from "./util/";
import type { PanelItemProps } from "./types";

/**
 * PanelItem component
 * @param props - PanelItemProps
 * @returns - PanelItem component
 */
export function PanelItem(props: PanelItemProps) {
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
    <Paper
      className={styles.item}
      variant={variant ?? "panel-item"}
      key={itemId}
      withBorder
    >
      <PanelItemHeader
        title={title}
        itemId={itemId}
        unseen={unseen}
        itemActions={itemActions}
        badges={badges}
        icons={icons}
      />
      {children && <Box>{children}</Box>}
      {date && <Box c={panelItemTextColors(unseen).textColor}>{date}</Box>}{" "}
    </Paper>
  );
}
