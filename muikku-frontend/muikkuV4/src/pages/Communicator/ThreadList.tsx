import { Paper, Text, Title } from "@mantine/core";

/**
 * CommunicatorThreadList - Communicator thread list page
 */
export function CommunicatorThreadList() {
  return (
    <Paper p="xl" withBorder>
      <Title order={1} mb="md">
        CommunicatorThreadList
      </Title>
      <Text size="lg" c="dimmed" mb="lg">
        This is the communicator thread list page.
      </Text>
    </Paper>
  );
}
