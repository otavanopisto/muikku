import { Text, Paper } from "@mantine/core";

/**
 * Guider - Guider page
 */
export function Guider() {
  return (
    <Paper p="xl" withBorder>
      <Text size="lg" c="dimmed" mb="lg">
        You are now in the guider area of the application.
      </Text>
      <Text mb="xl">This is where you can access guider features</Text>
    </Paper>
  );
}
