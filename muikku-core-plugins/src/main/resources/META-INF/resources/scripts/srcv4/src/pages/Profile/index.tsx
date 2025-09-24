import { Container, Text, Paper } from "@mantine/core";

/**
 * Profile - Profile page
 */
export function Profile() {
  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the profile area of the application.
        </Text>
        <Text mb="xl">
          This is where you can access settings and preferences for your
          profile.
        </Text>
      </Paper>
    </Container>
  );
}
