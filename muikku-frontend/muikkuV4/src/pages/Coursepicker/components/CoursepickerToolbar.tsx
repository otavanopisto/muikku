import { useState } from "react";
import { ActionIcon, Group, Pill, PillsInput, TextInput } from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsSort,
  IconSearch,
} from "@tabler/icons-react";
import { MOCK_FILTER_CHIPS } from "../mockData";

/**
 * Toolbar: course search + filter pills (mock state until Phase 2).
 */
export function CoursepickerToolbar() {
  const [search, setSearch] = useState("");
  const [chips, setChips] = useState(MOCK_FILTER_CHIPS);

  /**
   * Remove a chip from the list
   * @param label - The label of the chip to remove
   */
  function removeChip(label: string) {
    setChips((prev) => prev.filter((c) => c !== label));
  }

  return (
    <Group gap="sm" wrap="wrap" align="center">
      <TextInput
        placeholder="Hae kursseja"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        style={{ flex: 1, minWidth: 200 }}
      />

      <PillsInput
        aria-label="Kurssisuodattimet"
        style={{ flex: 1, minWidth: 200 }}
        rightSection={<IconArrowsSort size={18} />}
        title="Kurssisuodattimet"
      >
        <Pill.Group>
          {chips.map((chip) => (
            <Pill key={chip} withRemoveButton onRemove={() => removeChip(chip)}>
              {chip}
            </Pill>
          ))}
          <PillsInput.Field
            placeholder=""
            readOnly
            style={{ width: 0, minWidth: 0, padding: 0 }}
          />
        </Pill.Group>
      </PillsInput>

      <ActionIcon variant="default" aria-label="Suodattimet">
        <IconAdjustmentsHorizontal size={18} />
      </ActionIcon>
    </Group>
  );
}
