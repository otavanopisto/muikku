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
    <MaterialLoader
      material={page}
      workspace={workspace}
      folder={folder ?? undefined}
      config={SAVED_PAGE_CONFIG}
      flash={active}
    />
  );
}
