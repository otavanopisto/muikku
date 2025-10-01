import { Text, Paper } from "@mantine/core";

/**
 * Evaluation - Evaluation page
 */
export function Evaluation() {
  return (
    <Paper p="xl" withBorder>
      <Text size="lg" c="dimmed" mb="lg">
        You are now in the evaluation area of the application.
      </Text>
      <Text mb="xl">This is where you can access evaluation features</Text>
    </Paper>
  );
}
