import { ActionIcon, Badge, Box, Group, Menu, Title } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";
import styles from "../Panel.module.css";
import { panelItemTextColors } from "./util/";
import type { PanelItemBadge, PanelMenuItem } from "./types";

/**
 * Props for a panel item header
 */
interface PanelItemHeaderProps {
  title: string;
  unseen?: boolean;
  itemActions?: PanelMenuItem[];
  badges?: PanelItemBadge | PanelItemBadge[];
  icons?: React.ReactNode;
  itemId: number | string;
}

/**
 * Panel item header component
 * @param props - PanelItemHeaderProps
 * @returns - PanelItemHeader component
 */
export function PanelItemHeader(props: PanelItemHeaderProps) {
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
        className={styles.itemTitle}
      >
        <Box className={styles.itemTitleContent}>
          {icons && <Group className={styles.itemTitleGroup}>{icons}</Group>}
          {title}
        </Box>
        {itemActions && <Group>{actions}</Group>}
      </Title>
      {badges && (
        <Box>
          {Array.isArray(badges) ? (
            badges.map((badge) => (
              <Badge
                className={styles.badge}
                tt="none"
                key={badge.label}
                variant="outline"
                color={badge.state ?? badge.color}
              >
                {badge.label}
              </Badge>
            ))
          ) : (
            <Badge
              tt="none"
              variant="outline"
              color={badges.state ?? badges.color}
            >
              {badges.label}
            </Badge>
          )}
        </Box>
      )}
    </>
  );
}
