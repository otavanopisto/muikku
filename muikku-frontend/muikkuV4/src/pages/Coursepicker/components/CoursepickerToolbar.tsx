import { useMemo, useState } from "react";
import {
  ActionIcon,
  CheckIcon,
  Combobox,
  Group,
  Pill,
  PillsInput,
  TextInput,
  useCombobox,
} from "@mantine/core";
import {
  IconAdjustmentsHorizontal,
  IconArrowsSort,
  IconSearch,
} from "@tabler/icons-react";
import type { EducationType } from "~/generated/client";
import {
  isMandatorityFilter,
  MANDATORITY_FILTER_OPTIONS,
  type MandatorityFilter,
} from "../types";

/**
 * Coursepicker toolbar props
 */
interface CoursepickerToolbarProps {
  q: string;
  educationTypeOptions: EducationType[];
  educationTypes: string[];
  mandatority: MandatorityFilter[];
  onQChange: (value: string) => void;
  onToggleEducationType: (identifier: string) => void;
  onRemoveEducationType: (identifier: string) => void;
  onToggleMandatority: (value: MandatorityFilter) => void;
  onRemoveMandatority: (value: MandatorityFilter) => void;
}

/**
 * Coursepicker toolbar
 */
export function CoursepickerToolbar(props: CoursepickerToolbarProps) {
  const {
    q,
    educationTypeOptions,
    educationTypes,
    mandatority,
    onQChange,
    onToggleEducationType,
    onRemoveEducationType,
    onToggleMandatority,
    onRemoveMandatority,
  } = props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [filterSearch, setFilterSearch] = useState("");
  const needle = filterSearch.trim().toLowerCase();

  const selectedEducationOptions = useMemo(
    () =>
      educationTypes
        .map((id) =>
          educationTypeOptions.find((option) => option.identifier === id)
        )
        .filter((option): option is EducationType => option != null),
    [educationTypes, educationTypeOptions]
  );

  const selectedMandatorityOptions = useMemo(
    () =>
      MANDATORITY_FILTER_OPTIONS.filter((option) =>
        mandatority.includes(option.value)
      ),
    [mandatority]
  );

  const hasSelectedPills =
    selectedEducationOptions.length > 0 ||
    selectedMandatorityOptions.length > 0;

  const educationDropdownOptions = educationTypeOptions
    .filter((option) => option.name.toLowerCase().includes(needle))
    .map((option) => {
      const active = educationTypes.includes(option.identifier);
      return (
        <Combobox.Option
          value={option.identifier}
          key={option.identifier}
          active={active}
        >
          <Group gap="sm">
            {active ? <CheckIcon size={12} /> : null}
            <span>{option.name}</span>
          </Group>
        </Combobox.Option>
      );
    });

  const mandatorityDropdownOptions = MANDATORITY_FILTER_OPTIONS.filter(
    (option) => option.label.toLowerCase().includes(needle)
  ).map((option) => {
    const active = mandatority.includes(option.value);
    return (
      <Combobox.Option value={option.value} key={option.value} active={active}>
        <Group gap="sm">
          {active ? <CheckIcon size={12} /> : null}
          <span>{option.label}</span>
        </Group>
      </Combobox.Option>
    );
  });

  const hasDropdownOptions =
    educationDropdownOptions.length > 0 ||
    mandatorityDropdownOptions.length > 0;

  /**
   * Remove the last pill
   */
  function removeLastPill() {
    if (selectedMandatorityOptions.length > 0) {
      const last =
        selectedMandatorityOptions[selectedMandatorityOptions.length - 1];
      onRemoveMandatority(last.value);
      return;
    }
    if (educationTypes.length > 0) {
      onRemoveEducationType(educationTypes[educationTypes.length - 1]);
    }
  }

  return (
    <Group gap="sm" wrap="wrap" align="center">
      <TextInput
        placeholder="Hae kursseja"
        value={q}
        onChange={(e) => onQChange(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        style={{ flex: 1, minWidth: 200 }}
      />

      <Combobox
        store={combobox}
        onOptionSubmit={(value) => {
          if (isMandatorityFilter(value)) {
            onToggleMandatority(value);
          } else {
            onToggleEducationType(value);
          }
          setFilterSearch("");
          combobox.updateSelectedOptionIndex("active");
        }}
      >
        <Combobox.DropdownTarget>
          <PillsInput
            aria-label="Kurssisuodattimet"
            style={{ flex: 1, minWidth: 200 }}
            rightSection={<IconArrowsSort size={18} />}
            onClick={() => combobox.openDropdown()}
          >
            <Pill.Group>
              {selectedEducationOptions.map((option) => (
                <Pill
                  key={option.identifier}
                  withRemoveButton
                  onRemove={() => onRemoveEducationType(option.identifier)}
                >
                  {option.name}
                </Pill>
              ))}

              {selectedMandatorityOptions.map((option) => (
                <Pill
                  key={option.value}
                  withRemoveButton
                  onRemove={() => onRemoveMandatority(option.value)}
                >
                  {option.label}
                </Pill>
              ))}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  value={filterSearch}
                  placeholder={hasSelectedPills ? "" : "Suodattimet"}
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setFilterSearch(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Backspace" &&
                      filterSearch.length === 0 &&
                      hasSelectedPills
                    ) {
                      event.preventDefault();
                      removeLastPill();
                    }
                  }}
                />
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>

        <Combobox.Dropdown>
          <Combobox.Options>
            {hasDropdownOptions ? (
              <>
                {educationDropdownOptions.length > 0 ? (
                  <Combobox.Group label="Koulutusaste">
                    {educationDropdownOptions}
                  </Combobox.Group>
                ) : null}
                {mandatorityDropdownOptions.length > 0 ? (
                  <Combobox.Group label="Pakollisuus">
                    {mandatorityDropdownOptions}
                  </Combobox.Group>
                ) : null}
              </>
            ) : (
              <Combobox.Empty>Ei tuloksia</Combobox.Empty>
            )}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>

      <ActionIcon variant="default" aria-label="Suodattimet">
        <IconAdjustmentsHorizontal size={18} />
      </ActionIcon>
    </Group>
  );
}
