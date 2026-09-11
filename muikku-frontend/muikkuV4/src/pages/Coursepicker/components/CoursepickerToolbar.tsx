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
import type {
  Curriculum,
  EducationType,
  WorkspaceOrganization,
} from "~/generated/client";
import {
  decodeFilterOptionValue,
  encodeFilterOptionValue,
  isMandatorityFilter,
  MANDATORITY_FILTER_OPTIONS,
  type CoursepickerFilterOption,
  type MandatorityFilter,
} from "../types";

/**
 * Coursepicker toolbar props
 */
interface CoursepickerToolbarProps {
  q: string;
  educationTypeOptions: EducationType[];
  curriculumOptions: Curriculum[];
  organizationOptions: WorkspaceOrganization[];
  educationTypes: string[];
  curriculums: string[];
  organizations: string[];
  mandatority: MandatorityFilter[];
  onQChange: (value: string) => void;
  onToggleEducationType: (identifier: string) => void;
  onRemoveEducationType: (identifier: string) => void;
  onToggleCurriculum: (identifier: string) => void;
  onRemoveCurriculum: (identifier: string) => void;
  onToggleOrganization: (identifier: string) => void;
  onRemoveOrganization: (identifier: string) => void;
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
    curriculumOptions,
    organizationOptions,
    educationTypes,
    curriculums,
    organizations,
    mandatority,
    onQChange,
    onToggleEducationType,
    onRemoveEducationType,
    onToggleCurriculum,
    onRemoveCurriculum,
    onToggleOrganization,
    onRemoveOrganization,
    onToggleMandatority,
    onRemoveMandatority,
  } = props;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [filterSearch, setFilterSearch] = useState("");
  const needle = filterSearch.trim().toLowerCase();

  const selectedOptions = useMemo((): CoursepickerFilterOption[] => {
    const selected: CoursepickerFilterOption[] = [];

    for (const id of educationTypes) {
      const option = educationTypeOptions.find((o) => o.identifier === id);
      if (option) {
        selected.push({
          kind: "educationType",
          value: option.identifier,
          label: option.name,
        });
      }
    }
    for (const id of curriculums) {
      const option = curriculumOptions.find((o) => o.identifier === id);
      if (option) {
        selected.push({
          kind: "curriculum",
          value: option.identifier,
          label: option.name,
        });
      }
    }
    for (const id of organizations) {
      const option = organizationOptions.find((o) => o.identifier === id);
      if (option) {
        selected.push({
          kind: "organization",
          value: option.identifier,
          label: option.name,
        });
      }
    }
    for (const option of MANDATORITY_FILTER_OPTIONS) {
      if (mandatority.includes(option.value)) {
        selected.push({
          kind: "mandatority",
          value: option.value,
          label: option.label,
        });
      }
    }

    return selected;
  }, [
    educationTypes,
    educationTypeOptions,
    curriculums,
    curriculumOptions,
    organizations,
    organizationOptions,
    mandatority,
  ]);

  /**
   * Check if an option is active
   * @param option - The option to check
   * @returns True if the option is active, false otherwise
   */
  function isActive(option: CoursepickerFilterOption): boolean {
    switch (option.kind) {
      case "educationType":
        return educationTypes.includes(option.value);
      case "curriculum":
        return curriculums.includes(option.value);
      case "organization":
        return organizations.includes(option.value);
      case "mandatority":
        return isMandatorityFilter(option.value)
          ? mandatority.includes(option.value)
          : false;
    }
  }

  /**
   * Toggle an option
   * @param option - The option to toggle
   */
  function toggleOption(option: CoursepickerFilterOption) {
    switch (option.kind) {
      case "educationType":
        onToggleEducationType(option.value);
        break;
      case "curriculum":
        onToggleCurriculum(option.value);
        break;
      case "organization":
        onToggleOrganization(option.value);
        break;
      case "mandatority":
        if (isMandatorityFilter(option.value)) {
          onToggleMandatority(option.value);
        }
        break;
    }
  }

  /**
   * Remove an option
   * @param option - The option to remove
   */
  function removeOption(option: CoursepickerFilterOption) {
    switch (option.kind) {
      case "educationType":
        onRemoveEducationType(option.value);
        break;
      case "curriculum":
        onRemoveCurriculum(option.value);
        break;
      case "organization":
        onRemoveOrganization(option.value);
        break;
      case "mandatority":
        if (isMandatorityFilter(option.value)) {
          onRemoveMandatority(option.value);
        }
        break;
    }
  }

  /**
   * Render group options
   * @param options - The options to render
   * @returns The rendered options
   */
  function renderGroupOptions(
    options: CoursepickerFilterOption[]
  ): React.ReactNode[] {
    return options
      .filter((option) => option.label.toLowerCase().includes(needle))
      .map((option) => {
        const active = isActive(option);
        const encoded = encodeFilterOptionValue(option.kind, option.value);
        return (
          <Combobox.Option value={encoded} key={encoded} active={active}>
            <Group gap="sm">
              {active ? <CheckIcon size={12} /> : null}
              <span>{option.label}</span>
            </Group>
          </Combobox.Option>
        );
      });
  }

  const educationDropdown = renderGroupOptions(
    educationTypeOptions.map((o) => ({
      kind: "educationType" as const,
      value: o.identifier,
      label: o.name,
    }))
  );
  const curriculumDropdown = renderGroupOptions(
    curriculumOptions.map((o) => ({
      kind: "curriculum" as const,
      value: o.identifier,
      label: o.name,
    }))
  );
  const organizationDropdown = renderGroupOptions(
    organizationOptions.map((o) => ({
      kind: "organization" as const,
      value: o.identifier,
      label: o.name,
    }))
  );
  const mandatorityDropdown = renderGroupOptions(
    MANDATORITY_FILTER_OPTIONS.map((o) => ({
      kind: "mandatority" as const,
      value: o.value,
      label: o.label,
    }))
  );

  const hasDropdownOptions =
    educationDropdown.length > 0 ||
    curriculumDropdown.length > 0 ||
    organizationDropdown.length > 0 ||
    mandatorityDropdown.length > 0;

  return (
    <Group gap="sm" wrap="wrap" align="center" mb="md">
      <TextInput
        placeholder="Hae kursseja"
        value={q}
        onChange={(e) => onQChange(e.currentTarget.value)}
        leftSection={<IconSearch size={16} />}
        style={{ flex: 1, minWidth: 200 }}
      />

      <Combobox
        store={combobox}
        onOptionSubmit={(encoded) => {
          const decoded = decodeFilterOptionValue(encoded);
          if (!decoded) return;
          toggleOption({
            kind: decoded.kind,
            value: decoded.value,
            label: "",
          });
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
              {selectedOptions.map((option) => (
                <Pill
                  key={encodeFilterOptionValue(option.kind, option.value)}
                  withRemoveButton
                  onRemove={() => removeOption(option)}
                >
                  {option.label}
                </Pill>
              ))}

              <Combobox.EventsTarget>
                <PillsInput.Field
                  value={filterSearch}
                  placeholder={selectedOptions.length > 0 ? "" : "Suodattimet"}
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
                      selectedOptions.length > 0
                    ) {
                      event.preventDefault();
                      removeOption(selectedOptions[selectedOptions.length - 1]);
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
                {educationDropdown.length > 0 ? (
                  <Combobox.Group label="Koulutusaste">
                    {educationDropdown}
                  </Combobox.Group>
                ) : null}
                {curriculumDropdown.length > 0 ? (
                  <Combobox.Group label="OPS">
                    {curriculumDropdown}
                  </Combobox.Group>
                ) : null}
                {organizationDropdown.length > 0 ? (
                  <Combobox.Group label="Organisaatio">
                    {organizationDropdown}
                  </Combobox.Group>
                ) : null}
                {mandatorityDropdown.length > 0 ? (
                  <Combobox.Group label="Pakollisuus">
                    {mandatorityDropdown}
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
