import { Paper, Text, Title } from "@mantine/core";

/**
 * AnnouncerList - Announcer list page
 */
export function AnnouncerList() {
  return (
    <Paper p="xl" withBorder>
      <Title order={1} mb="md">
        AnnouncerList
      </Title>
      <Text size="lg" c="dimmed" mb="lg">
        This is the announcer list page.
      </Text>
    </Paper>
  );
}
