import { useCallback, useMemo, useState } from "react";
import { ActionIcon, Divider, Group, Tooltip } from "@mantine/core";
import {
  IconArrowBackUp,
  IconCopy,
  IconEye,
  IconFileText,
  IconLock,
  IconNotebook,
  IconPencil,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import {
  MaterialViewRestriction,
  type MaterialContentNode,
} from "~/generated/client";
import {
  isPageDraftPublishable,
  materialPageDraftAtom,
} from "~/src/atoms/workspaceContentDrafts";
import { ConfirmDialog } from "~/src/components/Dialogs/ConfirmDialog/ConfirmDialog";
import { useMaterialContentContext } from "./MaterialContentProvider";
import type { MaterialEditingActionContext } from "./types";
import classes from "./MaterialPage.module.css";

/**
 * Authoring toolbar: start/stop edit, publish, revert, plus stubs.
 * Renders nothing when editing capability is absent.
 */
export function MaterialEditingToolbar() {
  const { material, workspace, editing } = useMaterialContentContext();

  const [confirmClose, setConfirmClose] = useState(false);

  const savedPage = editing?.savedPage ?? material;
  const draftAtom = useMemo(
    () => materialPageDraftAtom(savedPage.workspaceMaterialId),
    [savedPage.workspaceMaterialId]
  );
  const draft = useAtomValue(draftAtom);
  const canPublish = isPageDraftPublishable(savedPage, draft);
  const publishing = editing?.publishing ?? false;
  const active = editing?.active ?? false;

  const actionCtx: MaterialEditingActionContext | null = useMemo(
    () => (editing && workspace ? { material, workspace, editing } : null),
    [editing, workspace, material]
  );

  /**
   * Handle stop editing click.
   */
  const handleStopEditingClick = useCallback(() => {
    if (canPublish) {
      setConfirmClose(true);
      return;
    }
    if (actionCtx) editing?.onStopEditing?.(actionCtx);
  }, [canPublish, actionCtx, editing]);

  if (!editing) {
    return null;
  }

  return (
    <div className={classes.toolbar}>
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Group gap="xs" wrap="nowrap">
          {active ? (
            <>
              <Tooltip
                label={
                  canPublish
                    ? "Julkaise muutokset"
                    : "Ei julkaistavia muutoksia"
                }
              >
                <ActionIcon
                  variant="subtle"
                  aria-label="Julkaise muutokset"
                  disabled={!canPublish || publishing}
                  onClick={() => actionCtx && editing.onPublish?.(actionCtx)}
                >
                  <IconUpload size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                label={
                  canPublish ? "Peru muutokset" : "Ei peruttavia muutoksia"
                }
              >
                <ActionIcon
                  variant="subtle"
                  aria-label="Peru muutokset"
                  disabled={!canPublish}
                  onClick={() => actionCtx && editing.onRevert?.(actionCtx)}
                >
                  <IconArrowBackUp size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Lopeta muokkaus">
                <ActionIcon
                  variant="subtle"
                  aria-label="Lopeta muokkaus"
                  disabled={publishing}
                  onClick={handleStopEditingClick}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Tooltip>
            </>
          ) : (
            <Tooltip label="Aloita muokkaus">
              <ActionIcon
                variant="subtle"
                aria-label="Aloita muokkaus"
                onClick={() => actionCtx && editing.onEdit?.(actionCtx)}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>
          )}
          <Divider orientation="vertical" />
          <ActionIcon variant="subtle" aria-label="Kopioi" disabled>
            <IconCopy size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" aria-label="Esikatsele" disabled>
            <IconEye size={16} />
          </ActionIcon>
          <span className={classes.meta}>
            <IconLock size={16} />
            {restrictionLabel(material.viewRestrict)}
          </span>
          <span className={classes.meta}>
            {pageTypeIcon(material.assignmentType)}
            {pageTypeLabel(material.assignmentType)}
          </span>
        </Group>
        <ActionIcon variant="subtle" color="red" aria-label="Poista" disabled>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>

      <ConfirmDialog
        opened={confirmClose}
        title="Julkaisemattomat muutokset"
        size="md"
        cancelLabel="Jatka muokkausta"
        confirmLabel="Lopeta tallentamatta"
        onCancel={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          if (actionCtx) editing.onStopEditing?.(actionCtx);
        }}
      >
        Sivulla on julkaisemattomia muutoksia. Jos lopetat muokkauksen,
        muutokset häviävät.
      </ConfirmDialog>
    </div>
  );
}

/**
 * View-restriction label for the idle/editing toolbar.
 * @param viewRestrict - Node viewRestrict
 */
function restrictionLabel(
  viewRestrict: MaterialContentNode["viewRestrict"]
): string {
  switch (viewRestrict) {
    case MaterialViewRestriction.LoggedIn:
      return "Kirjautuneille";
    case MaterialViewRestriction.WorkspaceMembers:
      return "Jäsenille";
    default:
      return "Kaikille";
  }
}

/**
 * Page-type label for the toolbar.
 * @param assignmentType - Node assignment type
 */
function pageTypeLabel(
  assignmentType: MaterialContentNode["assignmentType"]
): string {
  switch (assignmentType) {
    case "EXERCISE":
      return "Harjoitustehtävä";
    case "EVALUATED":
      return "Arvioitava tehtävä";
    case "JOURNAL":
      return "Oppimispäiväkirja";
    case "INTERIM_EVALUATION":
      return "Välipalautetehtävä";
    default:
      return "Teoriasivu";
  }
}

/**
 * Page-type icon for the toolbar.
 * @param assignmentType - Node assignment type
 */
function pageTypeIcon(assignmentType: MaterialContentNode["assignmentType"]) {
  switch (assignmentType) {
    case "JOURNAL":
      return <IconNotebook size={16} />;
    default:
      return <IconFileText size={16} />;
  }
}
