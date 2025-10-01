import { Text, Paper } from "@mantine/core";

/**
 * Announcer - Announcer page
 */
export function Announcer() {
  return (
    <Paper p="xl" withBorder>
      <Text size="lg" c="dimmed" mb="lg">
        You are now in the announcer area of the application.
      </Text>
      <Text mb="xl">This is where you can access announcer features</Text>
    </Paper>
  );
}
