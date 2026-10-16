import { Title, Button, Stack } from "@mantine/core";
import { useAtomValue } from "jotai";
import { lastWorkspacesDataAtom } from "src/atoms/user";
import { Link } from "react-router";
import { Empty } from "src/components/Empty";
import { Fragment } from "react";
import Panel from "~/src/components/Panel/Panel";

/**
 * Workspaces
 * @returns
 */
export function Workspaces() {
  const lastWorkspaces = useAtomValue(lastWorkspacesDataAtom);

  if (lastWorkspaces.length === 0) {
    return <Empty title="No workspaces found" />;
  }
  return (
    <Panel title="TODO: Localize Studies">
      <Stack>
        {lastWorkspaces.map((workspace) => (
          <Fragment key={workspace.workspaceId}>
            <Title order={3} mb="md">
              Jatka opintoja: {workspace.workspaceName} -{" "}
              {workspace.materialName}
            </Title>
            <Button
              key={workspace.workspaceId}
              component={Link}
              to={workspace.url}
              variant="filled"
            >
              {workspace.workspaceName}
            </Button>
          </Fragment>
        ))}
      </Stack>
    </Panel>
  );
}
