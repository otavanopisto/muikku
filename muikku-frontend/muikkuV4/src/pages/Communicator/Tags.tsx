import { Paper, Text, Title } from "@mantine/core";

/**
 * CommunicatorTags - CommunicatorTags page
 */
export function CommunicatorTags() {
  return (
    <Paper p="xl" withBorder>
      <Title order={1} mb="md">
        CommunicatorTags
      </Title>
      <Text size="lg" c="dimmed" mb="lg">
        This is the communicator tags page.
      </Text>
      <Text mb="xl">
        This is where you can view and manage your communicator tags.
      </Text>
    </Paper>
  );
}
