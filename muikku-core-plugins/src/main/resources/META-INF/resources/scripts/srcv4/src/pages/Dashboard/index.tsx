import { Container, Title, Text, Paper, Button, Group } from "@mantine/core";
import { useAtomValue } from "jotai";
import { userAtom } from "~/src/atoms/auth";
import { Link } from "react-router";

/**
 * Dashboard - Dashboard page
 */
export function Dashboard() {
  const user = useAtomValue(userAtom);

  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Welcome back, {user?.displayName ?? "User"}!
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the authenticated area of the application.
        </Text>
        <Text mb="xl">
          This is where you can access all the features and pages available to
          authenticated users. Use the navigation bar above to explore different
          sections.
        </Text>
      </Paper>

      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Here is your workspace: bi1-elama-ja-evoluutio
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          Click link to access selected workspace
        </Text>

        <Group>
          <Button
            component={Link}
            to="/workspace/bi1-elama-ja-evoluutio"
            variant="filled"
          >
            Go to Test Workspace
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
