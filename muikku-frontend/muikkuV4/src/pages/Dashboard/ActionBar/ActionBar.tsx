import { IconDotsVertical } from "@tabler/icons-react";
import { Menu, Group, ActionIcon } from "@mantine/core";
import classes from "./ActionBar.module.css";
import type { User } from "~/src/services/auth";
import useActionBarItems from "./hooks/useActionBarItems";
import { useMemo, useState } from "react";
/**
 * Dashboard actions
 * Dashboard view actions consisting of mantine Group component */
interface DashboardActionsProps {
  user: User;
  onItemClick: (panelId: number) => void;
  userPanelIds: number[];
}

/**
 * @param props - DashboardActionsProps
 * @returns - DashboardActions component
 */
export function DashboardActions(props: DashboardActionsProps) {
  const [filterValue, setFilterValue] = useState("");
  const items = useActionBarItems();

  const { onItemClick, userPanelIds } = props;

  const filteredItems = useMemo(
    () =>
      items.filter((panel) =>
        panel.title.toLowerCase().includes(filterValue.toLowerCase())
      ),
    [items, filterValue]
  );

  return (
    <Group justify="flex-end" mb="md">
      <Menu closeOnItemClick={false}>
        <Menu.Target>
          <ActionIcon variant="subtle" aria-label="Dashboard actions">
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Search
            placeholder="Search panels"
            value={filterValue}
            onChange={(event) => setFilterValue(event.currentTarget.value)}
          />
          <Menu.Divider />
          {filteredItems.map((panel) => (
            <Menu.Item
              className={userPanelIds.includes(panel.id) ? classes.active : ""}
              onClick={() => onItemClick(panel.id)}
              key={panel.id}
            >
              {panel.title}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
