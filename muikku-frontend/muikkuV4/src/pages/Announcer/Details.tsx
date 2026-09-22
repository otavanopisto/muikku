import { Paper, Text, Title } from "@mantine/core";

/**
 * AnnouncerDetails - Announcer details page
 */
export function AnnouncerDetails() {
  return (
    <Paper p="xl" withBorder>
      <Title order={1} mb="md">
        AnnouncerCategories
      </Title>
      <Text size="lg" c="dimmed" mb="lg">
        This is the announcer categories page.
      </Text>
      <Text mb="xl">
        This is where you can view and manage your announcer categories.
      </Text>
    </Paper>
  );
}
