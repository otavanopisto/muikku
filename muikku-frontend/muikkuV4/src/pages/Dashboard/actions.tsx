// Dashboard actions
// Dashboard view actions consisting of mantine Group component
// Only action at this point is a button to open a menu with a search input to filter existing panels and ability to add a panel to the dashboard

import { IconDotsVertical } from "@tabler/icons-react";
import { Menu, Group, TextInput, ActionIcon } from "@mantine/core";
import { panels } from "./model/panels";
import { useState } from "react";
import { useInputState } from "@mantine/hooks";

export function DashboardActions() {
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
          <TextInput
            placeholder="Search panels"
            value={filterValue}
            onChange={(event) => onFilterChange(event.target.value)}
          />
          <Menu.Divider />
          {filteredPanels.map((panel) => (
            <Menu.Item key={panel.id}>{panel.title}</Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}
