import { Avatar, Button, Group, Paper, Stack, Text } from "@mantine/core";
import type { CatalogCourseItem } from "../types";

const CATALOG_META_WIDTH = 350;

/**
 * Props for the CatalogCoursePanel component
 */
interface CatalogCoursePanelProps {
  course: CatalogCourseItem;
}

/**
 * CatalogCoursePanel component
 * @param props - Props for the CatalogCoursePanel component
 */
export function CatalogCoursePanel(props: CatalogCoursePanelProps) {
  const { course } = props;

  return (
    <Stack gap="md">
      <Group align="flex-start" wrap="wrap" gap="xl">
        <Stack gap="md" style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm">{course.description}</Text>
        </Stack>
        <Paper
          withBorder
          p="md"
          radius="md"
          w={CATALOG_META_WIDTH}
          style={{ flexShrink: 0 }}
        >
          <Stack gap="md">
            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                Kurssin pituus
              </Text>
              <Text size="sm">{course.lengthLabel}</Text>
            </Stack>
            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                Kurssin opettaja
              </Text>
              <Group gap="sm" wrap="nowrap">
                <Avatar
                  radius="xl"
                  name={course.teacher.name}
                  color="initials"
                />
                <Stack gap={0} style={{ minWidth: 0 }}>
                  <Text size="sm" fw={500} truncate>
                    {course.teacher.name}
                  </Text>
                  <Text size="xs" c="dimmed" truncate>
                    {course.teacher.email}
                  </Text>
                </Stack>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      </Group>

      <Group gap="sm">
        <Button variant="filled">Tutustu</Button>
        <Button variant="default">Ilmoittaudu</Button>
      </Group>
    </Stack>
  );
}
