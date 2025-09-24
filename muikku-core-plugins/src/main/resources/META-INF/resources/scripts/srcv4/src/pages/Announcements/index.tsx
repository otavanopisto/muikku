import { Container, Text, Paper } from "@mantine/core";

/**
 * Announcements - Announcements page
 */
export function Announcements() {
  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the announcements area of the application.
        </Text>
        <Text mb="xl">This is where you can access announcements features</Text>
      </Paper>
    </Container>
  );
}
