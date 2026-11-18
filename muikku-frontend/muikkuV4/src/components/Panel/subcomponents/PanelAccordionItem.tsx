import { Accordion, Box, Paper } from "@mantine/core";
import styles from "../Panel.module.css";
import { PanelItemHeader } from "./PanelItemHeader";
import { panelItemTextColors } from "./util/";
import type { PanelItemProps } from "./types";

/**
 * Panel item for accordion container
 * @param props - PanelItemProps
 * @returns - PanelAccordionItem component
 */
export function PanelAccordionItem(props: PanelItemProps) {
  const { title, date, variant, itemId, unseen, badges, icons, children } =
    props;
  return (
    <Accordion.Item value={title}>
      <Paper
        className={styles.accordionItem}
        variant={variant ?? "panel-item"}
        key={itemId}
        withBorder
      >
        <Accordion.Control>
          <PanelItemHeader
            title={title}
            itemId={itemId}
            unseen={unseen}
            badges={badges}
            icons={icons}
          />
          <Box c={panelItemTextColors(unseen).textColor}>{date}</Box>
        </Accordion.Control>
        <Accordion.Panel>{children}</Accordion.Panel>
      </Paper>
    </Accordion.Item>
  );
}
