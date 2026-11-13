import { useCallback, useMemo, useRef, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import type { MaterialContentNode } from "~/generated/client";
import {
  clearMaterialPageDraftAtom,
  materialPageDraftUiAtom,
  patchMaterialPageDraftAtom,
  resolvedPageDraft,
  type MaterialPageDraft,
} from "~/src/atoms/workspaceContentDrafts";
import type { Workspace } from "~/src/RichContentLoader/coreMaterial";
import { MaterialLoader } from "src/RichContentLoader";
import type { Editor } from "@tiptap/core";
import { publishMaterialPageAtom } from "~/src/atoms/publishMaterialPage";

const PRODUCTION_PAGE_CONFIG = {
  enableButtons: false,
  enableAssessment: false,
  answerable: false,
  readOnly: true,
} as const;

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
 * Chrome lives in MaterialLoader; this host owns draft/publish.
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
  const publishPage = useSetAtom(publishMaterialPageAtom);
  const [publishing, setPublishing] = useState(false);
  const draftPage = resolvedPageDraft(page, draft);

  /**
   * Handle publish.
   */
  const handlePublish = useCallback(async () => {
    if (page.workspaceMaterialId == null || publishing) return;
    const instance = editorRef.current;
    let htmlFromEditor: string | undefined;
    if (instance && !instance.isDestroyed) {
      instance.commands.disableSourceMode();
      htmlFromEditor = instance.getText().trim() ? instance.getHTML() : "";
    }
    setPublishing(true);
    try {
      await publishPage({ page, htmlFromEditor });
    } catch (err) {
      window.alert(
        err instanceof Error ? err.message : "Julkaisu epäonnistui."
      );
    } finally {
      setPublishing(false);
    }
  }, [page, publishPage, publishing]);

  /**
   * Restore saved html on the live editor, then drop the in-memory draft.
   */
  const handleRevert = useCallback(() => {
    if (page.workspaceMaterialId == null) return;
    const instance = editorRef.current;
    if (instance && !instance.isDestroyed) {
      instance.commands.disableSourceMode();
      instance.commands.setContent(page.html ?? "", { emitUpdate: false });
    }
    clearDraft(page.workspaceMaterialId);
  }, [page.workspaceMaterialId, page.html, clearDraft]);

  /**
   * Handle stop editing.
   */
  const handleStopEditing = useCallback(() => {
    handleRevert();
    setEditing(false);
  }, [handleRevert]);

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
    <MaterialLoader
      material={editing ? draftPage : page}
      workspace={workspace}
      folder={folder ?? undefined}
      config={PRODUCTION_PAGE_CONFIG}
      editing={{
        config: {
          enabled: true,
          active: editing,
          publishing,
          savedHtml: page.html ?? "",
          savedPage: page,
          canEditContent: true,
          canSetTitle: true,
          canPublish: true,
          canRevert: true,
          canCopy: true,
          canDelete: true,
          canAddAttachments: true,
          canSetLicense: true,
          canSetProducers: true,
          canRestrictView: true,
          canChangePageType: true,
          canChangeExerciseType: true,
        },
        handlers: {
          onEdit: () => setEditing(true),
          onStopEditing: handleStopEditing,
          onPublish: () => void handlePublish(),
          onRevert: handleRevert,
          onTitleChange: handleTitleChange,
          onHtmlChange: handleHtmlChange,
          onPatch: handlePatch,
          onEditorReady: handleEditorReady,
        },
      }}
    />
  );
}
