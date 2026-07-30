import { ActionIcon, Group, Stack, Text, Title, Tooltip } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import type { CoursepickerSectionData } from "../types";
import { CourseListAccordion } from "./CourseListAccordion";

/**
 * Props for the CoursepickerSection component
 */
interface CoursepickerSectionProps {
  section: CoursepickerSectionData;
  defaultExpandedCourseId?: string;
}

/**
 * CoursepickerSection component
 * @param props - Props for the CoursepickerSection component
 */
export function CoursepickerSection(props: CoursepickerSectionProps) {
  const { section, defaultExpandedCourseId } = props;

  return (
    <Stack gap="sm">
      <Group gap="xs">
        <Title order={4}>{section.title}</Title>
        {section.info ? (
          <Tooltip label={section.info} multiline w={280}>
            <ActionIcon variant="subtle" size="sm" aria-label="Lisätietoa">
              <IconInfoCircle size={16} />
            </ActionIcon>
          </Tooltip>
        ) : null}
      </Group>

      {section.items.length === 0 ? (
        <Text size="sm" c="dimmed">
          Ei kursseja.
        </Text>
      ) : (
        <CourseListAccordion
          items={section.items}
          defaultExpandedId={defaultExpandedCourseId}
        />
      )}
    </Stack>
  );
}
