import { Title, Text, Paper, Burger, Box } from "@mantine/core";
import { useParams } from "react-router";
import { useAtomValue } from "jotai";
import { workspaceInfoAtom } from "src/atoms/workspace";
import { PageLayout } from "src/layouts";
import { useRootAside } from "~/src/layouts/helpers/useRootAside";
import { useAppLayout } from "~/src/hooks/useAppLayout";

/**
 * WorkspaceMaterials - Workspace materials page
 */
export function WorkspaceMaterials() {
  const { workspaceUrlName } = useParams();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  const { asideOpened, toggleAside } = useAppLayout();
  useRootAside({
    component: <div>Hello Materials</div>,
  });
  return (
    <PageLayout title="Workspace Materials">
      <Box hiddenFrom="md">
        <Burger
          opened={asideOpened}
          onClick={toggleAside}
          size="sm"
          aria-label="Toggle navigation"
        />
      </Box>
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
    </PageLayout>
  );
}
