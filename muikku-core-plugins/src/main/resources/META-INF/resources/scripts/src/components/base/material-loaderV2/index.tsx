/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { DataProvider, RenderProps, RenderState, StateConfig } from "./types";
import { useStateManager } from "./hooks/useStateManager";
import { useFieldManager } from "./hooks/useFieldManager";
import { useSyncManager } from "./hooks/useSyncManager";
import { useUIManager } from "./hooks/useUIManager";
import { MaterialAssigmentType } from "~/generated/client";

/**
 * Material loader props interface
 */
export interface MaterialLoaderV2Props {
  readonly invisible?: boolean;
  readonly dataProvider: DataProvider;
  readonly stateConfigs: StateConfig[];
  readonly children: (
    props: RenderProps,
    state: RenderState,
    config: StateConfig
  ) => React.ReactElement;
  readonly modifiers?: string | string[];
  readonly id?: string;
  readonly websocket: any;
  readonly readOnly?: boolean;
}

/**
 * Main MaterialLoaderV2 component
 * Orchestrates all the managers and renders content
 * @param props props
 * @returns MaterialLoaderV2 component
 */
export const MaterialLoaderV2: React.FC<MaterialLoaderV2Props> = React.memo(
  (props) => {
    const {
      dataProvider,
      children,
      modifiers = [],
      id,
      websocket,
      readOnly = false,
    } = props;

    // Initialize managers
    const uiManager = useUIManager(dataProvider);
    const stateManager = useStateManager(dataProvider, readOnly);
    const fieldManager = useFieldManager(
      dataProvider,
      dataProvider.onFieldChange
    );

    const syncManager = useSyncManager(
      dataProvider,
      websocket,
      fieldManager.markFieldSynced,
      fieldManager.markFieldError
    );

    // Get current state configuration
    const currentStateConfig = React.useMemo(
      () => stateManager.currentConfig,
      [stateManager]
    );

    // Build render props for children
    const renderProps: RenderProps = React.useMemo(
      () => ({
        userId: dataProvider.userId,
        folder: dataProvider.folder,
        material: dataProvider.material,
        workspace: dataProvider.workspace,
        currentState: dataProvider.currentState,
        assignmentType: dataProvider.assignmentType,
        editorPermissions: dataProvider.editorPermissions,
        context: dataProvider.context,
        answers: dataProvider.answers,
        uiManager: uiManager,
        stateManager: stateManager,
        fieldManager: fieldManager,
        getInterimEvaluationRequest: dataProvider.getInterimEvaluationRequest,
        startEditor: dataProvider.startEditor,
        // onFieldChange: (fieldName: string, value: any) => {
        //   fieldManager.handleFieldChange(fieldName, value);
        //   syncManager.queueFieldSync(fieldName, value);
        // },
      }),
      [dataProvider, stateManager, fieldManager, uiManager]
    );

    // Build render state for children
    const renderState: RenderState = React.useMemo(
      () => ({
        elements: [], // This will be populated by ContentRenderer
        compositeReply: dataProvider.compositeReply, // This should come from dataProvider if needed
        stateConfiguration: currentStateConfig,
      }),
      [currentStateConfig, dataProvider.compositeReply]
    );

    // Build CSS classes
    const className = React.useMemo(() => {
      const baseClass = "material-page";
      const materialPageType = returnMaterialPageType(
        stateManager.assignmentType
      );
      const modifierClasses = Array.isArray(modifiers)
        ? modifiers.map((mod) => `material-page--${mod}`)
        : [`material-page--${modifiers}`];

      const stateClass = currentStateConfig
        ? `material-page--${dataProvider.compositeReply?.state}`
        : "";

      const hiddenClass = stateManager.isHidden ? "state-HIDDEN" : "";

      return [
        baseClass,
        `material-page--${materialPageType}`,
        ...modifierClasses,
        stateClass,
        hiddenClass,
      ]
        .filter(Boolean)
        .join(" ");
    }, [
      stateManager,
      modifiers,
      currentStateConfig,
      dataProvider.compositeReply?.state,
    ]);

    // Cleanup on unmount
    React.useEffect(
      () => () => {
        console.log("MaterialLoaderV2 unmount");
        syncManager.clearPendingChanges();
      },
      [syncManager]
    );

    return (
      <article className={className} id={id}>
        {children(renderProps, renderState, currentStateConfig!)}
      </article>
    );
  },
  (prevProps, nextProps) => prevProps.dataProvider === nextProps.dataProvider
);

MaterialLoaderV2.displayName = "MaterialLoaderV2";

/**
 * returnMaterialPageType
 * @param assignmentType assignment type
 * @returns material page type
 */
const returnMaterialPageType = (assignmentType: MaterialAssigmentType) => {
  switch (assignmentType) {
    case "EXERCISE":
      return "exercise";

    case "EVALUATED":
      return "assignment";

    case "JOURNAL":
      return "journal";

    case "INTERIM_EVALUATION":
      return "interim-evaluation";

    default:
      return "theory";
  }
};

/**
 * Default export
 */
export default MaterialLoaderV2;
