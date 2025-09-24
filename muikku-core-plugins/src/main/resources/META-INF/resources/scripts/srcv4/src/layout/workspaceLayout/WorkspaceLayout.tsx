import { AppShell, Group, Title } from "@mantine/core";
import { Outlet, useParams } from "react-router";

/**
 * WorkspaceLayout - Workspace layout
 */
export function WorkspaceLayout() {
  const { workspaceUrlName } = useParams();
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header
        p="md"
        style={{ background: "#f0f6ff", borderBottom: "2px solid #228be6" }}
      >
        <Group justify="space-between" align="center" h="100%">
          <Title order={3} c="blue">
            Workspace: {workspaceUrlName}
          </Title>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
