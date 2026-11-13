import type {
  MaterialEditingCapability,
  MaterialEditingConfig,
  MaterialEditingHandlers,
} from "../types";

/**
 * Builds optional editing capability. Returns undefined when disabled.
 * Attaches handlers only when the matching can* flag is true.
 */
export function createEditingCapability(
  config?: Partial<MaterialEditingConfig>,
  handlers?: MaterialEditingHandlers
): MaterialEditingCapability | undefined {
  if (!config?.enabled) {
    return undefined;
  }

  const canDelete = config.canDelete ?? false;
  const canHide = config.canHide ?? false;
  const canPublish = config.canPublish ?? false;
  const canRevert = config.canRevert ?? false;
  const canRestrictView = config.canRestrictView ?? false;
  const canCopy = config.canCopy ?? false;
  const canChangePageType = config.canChangePageType ?? false;
  const canSetLicense = config.canSetLicense ?? false;
  const canSetProducers = config.canSetProducers ?? false;
  const canAddAttachments = config.canAddAttachments ?? false;
  const canEditContent = config.canEditContent ?? false;
  const canSetTitle = config.canSetTitle ?? false;

  return {
    enabled: true,
    active: config.active ?? false,
    publishing: config.publishing ?? false,
    savedHtml: config.savedHtml,
    savedPage: config.savedPage,
    canDelete,
    canHide,
    canPublish,
    canRevert,
    canRestrictView,
    canCopy,
    canChangePageType,
    canSetLicense,
    canSetProducers,
    canAddAttachments,
    canEditContent,
    canSetTitle,
    onEdit: canEditContent ? handlers?.onEdit : undefined,
    onStopEditing: handlers?.onStopEditing,
    onPublish: canPublish ? handlers?.onPublish : undefined,
    onRevert: canRevert ? handlers?.onRevert : undefined,
    onTitleChange: canSetTitle ? handlers?.onTitleChange : undefined,
    onHtmlChange: canEditContent ? handlers?.onHtmlChange : undefined,
    onPatch: handlers?.onPatch,
    onEditorReady: canEditContent ? handlers?.onEditorReady : undefined,
    onToggleHidden: canHide ? handlers?.onToggleHidden : undefined,
    onCopyPage: canCopy ? handlers?.onCopyPage : undefined,
  };
}
