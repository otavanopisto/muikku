import { Title, Button, Stack } from "@mantine/core";
import { useAtomValue } from "jotai";
import { lastWorkspacesDataAtom } from "src/atoms/user";
import { Link } from "react-router";
import { Empty } from "~/src/components/Empty/empty";
import { Fragment } from "react";
import Panel from "~/src/components/Panel/Panel";
import { useTranslation } from "react-i18next";
import styles from "./panels.module.css";

/**
 * Workspaces
 * @returns
 */
export default function Workspaces() {
  const lastWorkspaces = useAtomValue(lastWorkspacesDataAtom);
  const { t } = useTranslation(["workspaces", "common"]);
  if (lastWorkspaces.length === 0) {
    return <Empty title={t("labels.empty")} description={t("content.empty")} />;
  }
  return (
    <Panel title={t("labels.studies")}>
      <Stack>
        {lastWorkspaces.map((workspace) => (
          <Fragment key={workspace.workspaceId}>
            <Title order={3} className={styles.studiesTitle}>
              {t("labels.continueStudies", {
                location:
                  workspace.workspaceName + " - " + workspace.materialName,
              })}
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
