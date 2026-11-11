import { useCallback, useMemo, useRef, useState } from "react";
import { ActionIcon, Group, Paper, Tabs, Text, Tooltip } from "@mantine/core";
import {
  IconArrowBackUp,
  IconEye,
  IconLock,
  IconPencil,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  MaterialViewRestriction,
  type MaterialContentNode,
} from "~/generated/client";
import {
  clearMaterialPageDraftAtom,
  isPageDraftPublishable,
  materialPageDraftAtom,
  materialPageDraftUiAtom,
  patchMaterialPageDraftAtom,
  resolvedPageDraft,
  type MaterialPageDraft,
} from "~/src/atoms/workspaceContentDrafts";
import type { Workspace } from "~/src/RichContentLoader/coreMaterial";
import { SavedPageContent } from "./PagePreview";
import { PageContentTab } from "./PageContentTab";
import { PageMetadataTab } from "./PageMetadataTab";
import { PageAttachmentsTab } from "./PageAttachmentsTab";
import type { Editor } from "@tiptap/core";

/**
 * Props for one page on the authoring column.
 */
interface PageEditorProps {
  page: MaterialContentNode;
  folder: MaterialContentNode | null;
  workspace: Workspace;
}

/**
 * One material page. Starts idle; pen opens the editor.
 */
export function PageEditor(props: PageEditorProps) {
  const { page, folder, workspace } = props;
  const [editing, setEditing] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const draftAtom = useMemo(
    () => materialPageDraftUiAtom(page.workspaceMaterialId),
    [page.workspaceMaterialId]
  );
  const draft = useAtomValue(draftAtom);
  const patchDraft = useSetAtom(patchMaterialPageDraftAtom);
  const clearDraft = useSetAtom(clearMaterialPageDraftAtom);
  const draftPage = resolvedPageDraft(page, draft);

  /**
   * Restore saved html on the live editor, then drop the in-memory draft.
   */
  function handleRevert() {
    if (page.workspaceMaterialId == null) return;
    const instance = editorRef.current;
    if (instance && !instance.isDestroyed) {
      instance.commands.disableSourceMode();
      instance.commands.setContent(page.html ?? "", { emitUpdate: false });
    }
    clearDraft(page.workspaceMaterialId);
  }

  /**
   * Handle editor ready.
   * @param instance - Editor instance
   */
  const handleEditorReady = useCallback((instance: Editor | null) => {
    editorRef.current = instance;
  }, []);

  /**
   * Handle patch.
   * @param patch - Patch
   */
  const handlePatch = useCallback(
    (patch: MaterialPageDraft) => {
      if (page.workspaceMaterialId == null) return;
      patchDraft({ workspaceMaterialId: page.workspaceMaterialId, patch });
    },
    [page.workspaceMaterialId, patchDraft]
  );

  /**
   * Handle html change.
   * @param html - New html
   */
  const handleHtmlChange = useCallback(
    (html: string) => handlePatch({ html }),
    [handlePatch]
  );

  /**
   * Handle title change.
   * @param title - New title
   */
  const handleTitleChange = useCallback(
    (title: string) => handlePatch({ title }),
    [handlePatch]
  );

  return (
    <Paper p="md" radius="md" withBorder shadow={editing ? "xs" : undefined}>
      <PageToolbar
        page={page}
        editing={editing}
        onStartEditing={() => setEditing(true)}
        onRevert={handleRevert}
      />
      {editing ? (
        <Tabs defaultValue="content" mt="sm">
          <Tabs.List grow>
            <Tabs.Tab value="content">Sisältö</Tabs.Tab>
            <Tabs.Tab value="info">Tiedot</Tabs.Tab>
            <Tabs.Tab value="attachments">Liitteet</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="content" pt="md">
            <PageContentTab
              page={draftPage}
              savedHtml={page.html ?? ""}
              onEditorReady={handleEditorReady}
              onTitleChange={handleTitleChange}
              onHtmlChange={handleHtmlChange}
            />
          </Tabs.Panel>
          <Tabs.Panel value="info" pt="md">
            <PageMetadataTab page={draftPage} onPatch={handlePatch} />
          </Tabs.Panel>
          <Tabs.Panel value="attachments" pt="md">
            <PageAttachmentsTab
              workspaceMaterialId={page.workspaceMaterialId}
              workspaceUrlName={workspace.urlName}
            />
          </Tabs.Panel>
        </Tabs>
      ) : (
        <SavedPageContent page={page} folder={folder} workspace={workspace} />
      )}
    </Paper>
  );
}

/**
 * Idle: pen. Editing: publish + revert. Other actions are visual stubs.
 */
function PageToolbar(props: {
  page: MaterialContentNode;
  editing: boolean;
  onStartEditing: () => void;
  onRevert: () => void;
}) {
  const { page, editing, onStartEditing, onRevert } = props;
  const draftAtom = useMemo(
    () => materialPageDraftAtom(page.workspaceMaterialId),
    [page.workspaceMaterialId]
  );
  const draft = useAtomValue(draftAtom);
  const canPublish = isPageDraftPublishable(page, draft);

  return (
    <Group gap="xs" wrap="nowrap" justify="space-between">
      <Group gap="xs" wrap="nowrap">
        {editing ? (
          <>
            <Tooltip
              label={
                canPublish ? "Julkaise muutokset" : "Ei julkaistavia muutoksia"
              }
            >
              <ActionIcon
                variant="subtle"
                aria-label="Julkaise muutokset"
                disabled={!canPublish}
              >
                <IconUpload size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={canPublish ? "Peru muutokset" : "Ei peruttavia muutoksia"}
            >
              <ActionIcon
                variant="subtle"
                aria-label="Peru muutokset"
                disabled={!canPublish}
                onClick={onRevert}
              >
                <IconArrowBackUp size={16} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : (
          <Tooltip label="Aloita muokkaus">
            <ActionIcon
              variant="subtle"
              aria-label="Aloita muokkaus"
              onClick={onStartEditing}
            >
              <IconPencil size={16} />
            </ActionIcon>
          </Tooltip>
        )}
        <ActionIcon variant="subtle" aria-label="Kopioi" disabled>
          <IconEye size={16} />
        </ActionIcon>
        <Group gap={4} wrap="nowrap">
          <IconLock size={16} />
          <Text size="sm">{restrictionLabel(page.viewRestrict)}</Text>
        </Group>
        <Text size="sm">{pageTypeLabel(page.assignmentType)}</Text>
      </Group>
      <ActionIcon variant="subtle" color="red" aria-label="Poista" disabled>
        <IconTrash size={16} />
      </ActionIcon>
    </Group>
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
