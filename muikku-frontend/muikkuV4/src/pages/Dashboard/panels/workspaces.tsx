import { Title, Text, Paper, Button, Group } from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { lastWorkspacesQueryAtom } from "src/atoms/user";
import { Link } from "react-router";
import { Empty } from "src/components/Empty";
import { Fragment } from "react";

/**
 * Workspaces
 * @returns
 */
export function Workspaces() {
  const lastWorkspaces = useAtomValue(lastWorkspacesQueryAtom);

  if (lastWorkspaces.data?.length === 0) {
    return <Empty title="No workspaces found" />;
  }
  return (
    <Paper p="xl" withBorder>
      <Group>
        {lastWorkspaces.data?.map((workspace) => (
          <Fragment key={workspace.workspaceId}>
            <Title order={1} mb="md">
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
      </Group>
    </Paper>
  );
}
