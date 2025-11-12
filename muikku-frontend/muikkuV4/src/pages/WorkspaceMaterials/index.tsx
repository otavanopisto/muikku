import { Container, Title, Text, Paper } from "@mantine/core";
import { useParams } from "react-router";
import { useAtomValue } from "jotai";
import { workspaceInfoAtom } from "src/atoms/workspace";

/**
 * WorkspaceMaterials - Workspace materials page
 */
export function WorkspaceMaterials() {
  const { workspaceUrlName } = useParams();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Workspace Materials
        </Title>
        <Text size="lg" c="dimmed" mb="md">
          This is the materials page for your workspace.
        </Text>
        <Text size="md">
          <b>Workspace:</b> {workspaceInfo?.name ?? workspaceUrlName}
        </Text>
      </Paper>
    </Container>
  );
}
