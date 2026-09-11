/* eslint-disable react-x/no-array-index-key */
import { Badge, Group, Pill, Text } from "@mantine/core";
import type { CourseListItemBase } from "../types";

/**
 * Props for the CourseRowControl component
 */
interface CourseRowControlProps {
  course: CourseListItemBase;
}

/**
 * CourseRowControl component
 * @param props - Props for the CourseRowControl component
 */
export function CourseRowControl(props: CourseRowControlProps) {
  const { course } = props;

  return (
    <Group
      justify="space-between"
      wrap="nowrap"
      gap="md"
      align="center"
      style={{ flex: 1, minWidth: 0 }}
    >
      <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        <Badge variant="filled" radius="sm">
          {course.code}
        </Badge>
        <Text fw={500} truncate style={{ minWidth: 0 }}>
          {course.title}
        </Text>
      </Group>
      <Group
        gap="xs"
        wrap="nowrap"
        justify="flex-end"
        visibleFrom="sm"
        style={{ flexShrink: 0 }}
      >
        {course.chips.map((chip, index) => (
          <Pill key={`${course.id}-chip-${index}`} size="sm">
            {chip}
          </Pill>
        ))}
      </Group>
    </Group>
  );
}
