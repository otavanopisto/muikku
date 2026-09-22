import {
  Badge,
  Box,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconBook, IconCalendar, IconMessage } from "@tabler/icons-react";
import type { MyCourseItem } from "../types";

/**
 * Props for the MyCoursePanel component
 */
interface MyCoursePanelProps {
  course: MyCourseItem;
}

/**
 * MyCoursePanel component
 * @param props - Props for the MyCoursePanel component
 */
export function MyCoursePanel(props: MyCoursePanelProps) {
  const { course } = props;
  const practicePercent =
    course.practiceTasks.total > 0
      ? (course.practiceTasks.done / course.practiceTasks.total) * 100
      : 0;

  return (
    <Group
      align="flex-start"
      grow
      preventGrowOverflow={false}
      wrap="wrap"
      gap="xl"
    >
      <Stack gap="md" style={{ flex: 1, minWidth: 280 }}>
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            Kurssin tila
          </Text>
          <Badge variant="light">{course.statusLabel}</Badge>
        </Stack>
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            Arvioinnin tila
          </Text>
          <Text size="sm">{course.assessmentStatus}</Text>
        </Stack>
        <Stack gap="sm">
          <Group gap="sm">
            <ThemeIcon variant="light" size="sm">
              <IconCalendar size={14} />
            </ThemeIcon>
            <Text size="sm">{course.visitsLabel}</Text>
          </Group>
          <Group gap="sm">
            <ThemeIcon variant="light" size="sm">
              <IconBook size={14} />
            </ThemeIcon>
            <Text size="sm">{course.journalLabel}</Text>
          </Group>
          <Group gap="sm">
            <ThemeIcon variant="light" size="sm">
              <IconMessage size={14} />
            </ThemeIcon>
            <Text size="sm">{course.messagesLabel}</Text>
          </Group>
        </Stack>
      </Stack>

      <Stack gap="md" style={{ flex: 1, minWidth: 240 }}>
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            Arvioitavat tehtävät
          </Text>
          <Text size="sm" fw={500}>
            {course.gradedTasks.done}/{course.gradedTasks.total}
          </Text>
          <Text size="sm">{course.gradedTasks.summary}</Text>
        </Stack>
        <Stack gap={4}>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Harjoitustehtävät
            </Text>
            <Text size="sm">
              {course.practiceTasks.done}/{course.practiceTasks.total}
            </Text>
          </Group>
          <Progress value={practicePercent} size="sm" />
        </Stack>
        <Stack gap={4}>
          <Text size="sm" c="dimmed">
            Kurssin statistiikka
          </Text>
          <Box
            h={80}
            style={{
              border: "1px solid var(--mantine-color-default-border)",
              borderRadius: "var(--mantine-radius-sm)",
            }}
          >
            <Text size="xs" c="dimmed" p="xs">
              AreaChart placeholder — swap when @mantine/charts is wired
            </Text>
          </Box>
        </Stack>
      </Stack>
    </Group>
  );
}
