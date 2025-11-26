import { Title, Text, Paper } from "@mantine/core";
import { useParams } from "react-router";
import { useAtomValue } from "jotai";
import { workspaceInfoAtom } from "src/atoms/workspace";
import { useRootAside } from "src/layouts/helpers/useRootAside";
import { PageLayout } from "~/src/layouts";

/**
 * WorkspaceHelp - Workspace help page
 */
export function WorkspaceHelp() {
  const { workspaceUrlName } = useParams();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  useRootAside({
    component: <div>Hello Help</div>,
  });
  return (
    <PageLayout title="Workspace Help">
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Workspace Help
        </Title>
        <Text size="lg" c="dimmed" mb="md">
          This is the help page for your workspace.
        </Text>
        <Text size="md">
          <b>Workspace:</b> {workspaceInfo?.name ?? workspaceUrlName}
        </Text>
      </Paper>
    </PageLayout>
  );
}
