import { Title, Text, Paper } from "@mantine/core";
import { useParams } from "react-router";
import { PageLayout } from "~/src/layouts/PageLayout/PageLayout";

/**
 * WorkspaceSettings - Workspace settings page
 */
export function WorkspaceSettings() {
  const { workspaceUrlName } = useParams();

  return (
    <PageLayout title="Workspace Settings">
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Workspace Settings
        </Title>
        <Text size="lg" c="dimmed" mb="md">
          Here you can configure your workspace settings and preferences.
        </Text>
        <Text size="md">
          <b>Workspace:</b> {workspaceUrlName}
        </Text>
      </Paper>
    </PageLayout>
  );
}
