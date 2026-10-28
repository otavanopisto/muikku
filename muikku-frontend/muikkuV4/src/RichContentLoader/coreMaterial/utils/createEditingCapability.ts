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
  const disablePlugins = config.disablePlugins ?? false;
  const canPublish = config.canPublish ?? false;
  const canRevert = config.canRevert ?? false;
  const canRestrictView = config.canRestrictView ?? false;
  const canCopy = config.canCopy ?? false;
  const canChangePageType = config.canChangePageType ?? false;
  const canChangeExerciseType = config.canChangeExerciseType ?? false;
  const canSetLicense = config.canSetLicense ?? false;
  const canSetProducers = config.canSetProducers ?? false;
  const canAddAttachments = config.canAddAttachments ?? false;
  const canEditContent = config.canEditContent ?? false;
  const canSetTitle = config.canSetTitle ?? false;

  return {
    enabled: true,
    canDelete,
    canHide,
    disablePlugins,
    canPublish,
    canRevert,
    canRestrictView,
    canCopy,
    canChangePageType,
    canChangeExerciseType,
    canSetLicense,
    canSetProducers,
    canAddAttachments,
    canEditContent,
    canSetTitle,
    onEdit: canEditContent ? handlers?.onEdit : undefined,
    onToggleHidden: canHide ? handlers?.onToggleHidden : undefined,
    onCopyPage: canCopy ? handlers?.onCopyPage : undefined,
  };
}
