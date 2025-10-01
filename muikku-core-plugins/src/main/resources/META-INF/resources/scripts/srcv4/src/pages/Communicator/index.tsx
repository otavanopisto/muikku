import { Text, Paper } from "@mantine/core";

/**
 * Communicator - Communicator page
 */
export function Communicator() {
  return (
    <Paper p="xl" withBorder>
      <Text size="lg" c="dimmed" mb="lg">
        You are now in the communicator area of the application.
      </Text>
      <Text mb="xl">This is where you can access communicator features</Text>
    </Paper>
  );
}
