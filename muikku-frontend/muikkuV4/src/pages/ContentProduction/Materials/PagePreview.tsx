import { Paper } from "@mantine/core";
import type { MaterialContentNode } from "~/generated/client";
import { MaterialLoader } from "src/RichContentLoader";
import type { Workspace } from "src/RichContentLoader/coreMaterial/types";

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
      <MaterialLoader
        material={page}
        workspace={workspace}
        folder={folder ?? undefined}
        config={{
          enableButtons: false,
          enableAssessment: false,
          answerable: false,
          readOnly: true,
        }}
      />
    </Paper>
  );
}
