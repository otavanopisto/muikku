import { IconDotsVertical } from "@tabler/icons-react";
import { Menu, Group, ActionIcon } from "@mantine/core";
import { panels } from "../model/panels";
import { useState } from "react";
import { useInputState } from "@mantine/hooks";
import classes from "./ActionBar.module.css";

/**
 * Dashboard actions
 * Dashboard view actions consisting of mantine Group component */
interface DashboardActionsProps {
  onItemClick: (panelId: number) => void;
  userPanelIds: number[];
}

/**
 * @param props - DashboardActionsProps
 * @returns - DashboardActions component
 */
export function DashboardActions(props: DashboardActionsProps) {
  const { onItemClick, userPanelIds } = props;
  const [filterValue, setFilterValue] = useInputState("");
  const [filteredPanels, setFilteredPanels] = useState(panels);

  const onFilterChange = (value: string) => {
    setFilterValue(value);
    const filteredPanels = panels.filter((panel) =>
      panel.title.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPanels(filteredPanels);
  };

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
            onChange={(event) => onFilterChange(event.target.value)}
          />
          <Menu.Divider />
          {filteredPanels.map((panel) => (
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
