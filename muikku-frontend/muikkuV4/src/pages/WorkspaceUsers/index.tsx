import { Container, Title, Text, Paper } from "@mantine/core";
import { useParams } from "react-router";
import { useAtomValue } from "jotai";
import { workspaceInfoAtom } from "src/atoms/workspace";

/**
 * WorkspaceHome - Workspace home page
 */
export function WorkspaceUsers() {
  const { workspaceUrlName } = useParams();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Workspace Users
        </Title>
        <Text size="lg" c="dimmed" mb="md">
          This is the users page for your workspace.
        </Text>
        <Text size="md">
          <b>Workspace:</b> {workspaceInfo?.name ?? workspaceUrlName}
        </Text>
      </Paper>
    </Container>
  );
}
