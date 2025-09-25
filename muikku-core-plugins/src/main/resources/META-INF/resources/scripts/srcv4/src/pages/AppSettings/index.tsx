import { Container, Text, Paper } from "@mantine/core";

/**
 * AppSettings - App settings page
 */
export function AppSettings() {
  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the app settings area of the application.
        </Text>
        <Text mb="xl">This is where you can access app settings features</Text>
      </Paper>
    </Container>
  );
}
