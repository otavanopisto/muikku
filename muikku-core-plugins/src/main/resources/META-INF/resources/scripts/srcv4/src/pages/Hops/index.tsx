import { Container, Text, Paper } from "@mantine/core";

/**
 * Hops - Hops page
 */
export function Hops() {
  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the hops area of the application.
        </Text>
        <Text mb="xl">This is where you can access hops features</Text>
      </Paper>
    </Container>
  );
}
