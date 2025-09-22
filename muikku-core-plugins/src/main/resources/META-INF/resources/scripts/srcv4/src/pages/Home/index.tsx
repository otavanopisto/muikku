import { Container, Text, Paper } from "@mantine/core";

export function Home() {
  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the unauthenticated area of the application.
        </Text>
        <Text mb="xl">
          This is where you can access all the features and pages available to
          unauthenticated users. Use the navigation bar above to explore
          different sections.
        </Text>
      </Paper>
    </Container>
  );
}
