import { Container, Text, Paper } from "@mantine/core";

/**
 * Organization - Organization page
 */
export function Organization() {
  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the organization area of the application.
        </Text>
        <Text mb="xl">This is where you can access organization features</Text>
      </Paper>
    </Container>
  );
}
