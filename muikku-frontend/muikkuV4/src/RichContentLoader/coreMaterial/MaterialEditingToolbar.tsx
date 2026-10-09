import { useMaterialContentContext } from "./MaterialContentProvider";
import type { MaterialEditingActionContext } from "./types";

/**
 * Authoring toolbar: edit / hide / copy.
 * Renders nothing when editing capability is absent.
 */
export function MaterialEditingToolbar() {
  const { material, workspace, editing } = useMaterialContentContext();

  if (!editing) {
    return null;
  }

  const actionCtx: MaterialEditingActionContext = {
    material,
    workspace,
    editing,
  };

  return (
    <div className="material-page__editing-toolbar">
      {editing.canEditContent && editing.onEdit && (
        <button
          type="button"
          className="material-page__button material-page__button--edit"
          onClick={() => editing.onEdit?.(actionCtx)}
        >
          Edit
        </button>
      )}

      {editing.canHide && editing.onToggleHidden && (
        <button
          type="button"
          className="material-page__button material-page__button--hide"
          onClick={() => editing.onToggleHidden?.(actionCtx)}
        >
          Toggle hidden
        </button>
      )}

      {editing.canCopy && editing.onCopyPage && (
        <button
          type="button"
          className="material-page__button material-page__button--copy"
          onClick={() => editing.onCopyPage?.(actionCtx)}
        >
          Copy page
        </button>
      )}
    </div>
  );
}
