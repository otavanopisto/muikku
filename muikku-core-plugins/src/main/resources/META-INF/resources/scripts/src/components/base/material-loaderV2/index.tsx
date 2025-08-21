/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { MaterialLoaderV2Props, RenderProps, RenderState } from "./types";
import { useStateManager } from "./state/StateManager";
import { useFieldManager } from "./fields/FieldManager";
import { useSyncManager } from "./sync/SyncManager";

/**
 * Main MaterialLoaderV2 component
 * Orchestrates all the managers and renders content
 * @param props props
 * @returns MaterialLoaderV2 component
 */
export const MaterialLoaderV2: React.FC<MaterialLoaderV2Props> = (props) => {
  const {
    dataProvider,
    stateConfigs,
    children,
    modifiers = [],
    id,
    websocket,
    readOnly = false,
  } = props;

  // Initialize managers
  const stateManager = useStateManager(dataProvider, stateConfigs, readOnly);
  const fieldManager = useFieldManager(dataProvider, (fieldName, value) => {
    // Handle field changes
    dataProvider.onFieldChange(fieldName, value);
  });

  const syncManager = useSyncManager(
    dataProvider,
    websocket,
    (fieldName) => fieldManager.markFieldSynced(fieldName),
    (fieldName, error) => fieldManager.markFieldError(fieldName, error)
  );

  // Get current state configuration
  const currentStateConfig = React.useMemo(
    () => stateManager.getCurrentConfig(),
    [stateManager]
  );

  // Build render props for children
  const renderProps: RenderProps = React.useMemo(
    () => ({
      folder: dataProvider.folder,
      material: dataProvider.material,
      workspace: dataProvider.workspace,
      currentState: dataProvider.currentState,
      assignmentType: dataProvider.assignmentType,
      context: dataProvider.context,
      readOnly: stateManager.isReadOnly(),
      canEdit: stateManager.canEdit(),
      canSubmit: stateManager.canSubmit(),
      canViewAnswers: stateManager.shouldShowAnswers(),
      fields: fieldManager.getFields(),
      answers: dataProvider.answers,
      getInterimEvaluationRequest: dataProvider.getInterimEvaluationRequest,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onFieldChange: (fieldName: string, value: any) => {
        fieldManager.handleFieldChange(fieldName, value);
        syncManager.queueFieldSync(fieldName, value);
      },
      onSubmit: async () => {
        await dataProvider.onSubmit();
      },
      onModify: async () => {
        await dataProvider.onModify();
      },
    }),
    [dataProvider, stateManager, fieldManager, syncManager]
  );

  // Build render state for children
  const renderState: RenderState = React.useMemo(
    () => ({
      elements: [], // This will be populated by ContentRenderer
      compositeReplies: undefined, // This should come from dataProvider if needed
      stateConfiguration: currentStateConfig,
    }),
    [currentStateConfig]
  );

  // Build CSS classes
  const className = React.useMemo(() => {
    const baseClass = "material-page";
    const materialPageType = stateManager.getAssignmentType().toLowerCase();
    const modifierClasses = Array.isArray(modifiers)
      ? modifiers.map((mod) => `material-page--${mod}`)
      : [`material-page--${modifiers}`];

    const stateClass = currentStateConfig
      ? `material-page--${currentStateConfig.assignmentType.toLowerCase()}`
      : "";

    const hiddenClass = stateManager.isHidden() ? "state-HIDDEN" : "";

    return [
      baseClass,
      `material-page--${materialPageType}`,
      ...modifierClasses,
      stateClass,
      hiddenClass,
    ]
      .filter(Boolean)
      .join(" ");
  }, [modifiers, stateManager, currentStateConfig]);

  // Cleanup on unmount
  React.useEffect(
    () => () => {
      syncManager.destroy();
    },
    [syncManager]
  );

  return (
    <article className={className} id={id}>
      {children(renderProps, renderState, currentStateConfig!)}
    </article>
  );
};

/**
 * Default export
 */
export default MaterialLoaderV2;
