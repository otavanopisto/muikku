import { Container, Title, Text, Paper, Button, Group } from "@mantine/core";
import { useAtomValue } from "jotai";
import { userAtom } from "~/src/atoms/auth";
import { Link } from "react-router";
import { SimpleMaterialLoader } from "~/src/materials/MaterialLoader/variants/SimpleMaterialLoader";

const sampleHTML = `
  <div>
    <h1>Test Material</h1>
    <p>This is a test paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
    <img src="test-image.jpg" alt="Test image" />
    <table>
      <tr><th>Header 1</th><th>Header 2</th></tr>
      <tr><td>Cell 1</td><td>Cell 2</td></tr>
    </table>
    <object type="application/vnd.muikku.field.text">
      <param name="type" value="application/json" />
      <param name="content" value='{"name":"test-field","hint":"Enter your answer"}' />
    </object>
  </div>
`;

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

      <Paper p="xl" mt="md" withBorder>
        <SimpleMaterialLoader html={sampleHTML} />
      </Paper>
    </Container>
  );
}
