import { Paper } from "@mantine/core";
import type { MaterialContentNode } from "~/generated/client";
import { MaterialLoader } from "src/RichContentLoader";
import type { Workspace } from "src/RichContentLoader/coreMaterial/types";

const SAVED_PAGE_CONFIG = {
  enableButtons: false,
  enableAssessment: false,
  answerable: false,
  readOnly: true,
} as const;

/**
 * Static saved page body. Used by the preview column and idle PageEditor.
 */
export function SavedPageContent(props: {
  page: MaterialContentNode;
  folder: MaterialContentNode | null;
  workspace: Workspace;
}) {
  const { page, folder, workspace } = props;
  return (
    <MaterialLoader
      material={page}
      workspace={workspace}
      folder={folder ?? undefined}
      config={SAVED_PAGE_CONFIG}
    />
  );
}

/**
 * Last saved rendering of one page. Static html only — no drafts.
 */
export function PagePreview(props: {
  page: MaterialContentNode;
  folder: MaterialContentNode | null;
  workspace: Workspace;
  active: boolean;
}) {
  const { page, folder, workspace, active } = props;

  return (
    <Paper
      p="lg"
      radius="md"
      withBorder
      shadow="xs"
      data-active={active || undefined}
    >
      <SavedPageContent page={page} folder={folder} workspace={workspace} />
    </Paper>
  );
}
