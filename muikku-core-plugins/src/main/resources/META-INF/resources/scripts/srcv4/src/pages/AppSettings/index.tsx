import { Text, Paper } from "@mantine/core";

/**
 * AppSettings - App settings page
 */
export function AppSettings() {
  return (
    <Paper p="xl" withBorder>
      <Text size="lg" c="dimmed" mb="lg">
        You are now in the app settings area of the application.
      </Text>
      <Text mb="xl">This is where you can access app settings features</Text>
    </Paper>
  );
}
