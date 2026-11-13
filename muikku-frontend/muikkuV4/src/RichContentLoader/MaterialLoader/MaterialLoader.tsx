import { lazy, Suspense, type CSSProperties } from "react";
import type {
  MaterialEditingConfig,
  MaterialEditingHandlers,
  MaterialLoaderConfig,
  Workspace,
} from "../coreMaterial/types";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import { MaterialLoaderContainer } from "./MaterialLoaderContainer";
import { MaterialTitle } from "../coreMaterial/MaterialTitle";
import { MaterialContent } from "../coreMaterial/MaterialContent";
import { MaterialButtons } from "../coreMaterial/MaterialButtons";
import { MaterialAssessment } from "../coreMaterial/MaterialAssessment";
import { MaterialMetaFooter } from "../coreMaterial/MaterialMetaFooter";
import { MaterialEditingToolbar } from "../coreMaterial/MaterialEditingToolbar";
import classes from "../coreMaterial/MaterialPage.module.css";

// MaterialLoader is shared between student and production
// so we need to lazy load the MaterialPageEditor to avoid
// loading the editor in the student view.
const MaterialPageEditor = lazy(() =>
  import("./editing/MaterialPageEditor").then((m) => ({
    default: m.MaterialPageEditor,
  }))
);

/**
 * MaterialLoaderProps
 */
export interface MaterialLoaderProps {
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;
  folder?: MaterialContentNode;
  modifiers?: string | string[];
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Student TOC highlight. */
  flash?: boolean;
  config?: Partial<MaterialLoaderConfig>;
  editing?: {
    config?: Partial<MaterialEditingConfig>;
    handlers?: MaterialEditingHandlers;
  };
}

/**
 * MaterialLoader component
 * @param props - The props for the MaterialLoader component
 * @returns The MaterialLoader component
 */
export function MaterialLoader(props: MaterialLoaderProps) {
  const editingEnabled = Boolean(props.editing?.config?.enabled);
  const editingActive = Boolean(
    editingEnabled && props.editing?.config?.active
  );
  const className = [classes.page, props.className].filter(Boolean).join(" ");

  return (
    <MaterialLoaderContainer {...props} className={className}>
      <div
        className="material-page__inner"
        data-editing={editingActive || undefined}
      >
        {editingEnabled ? <MaterialEditingToolbar /> : null}
        {editingActive ? (
          <Suspense fallback={null}>
            <MaterialPageEditor />
          </Suspense>
        ) : (
          <>
            <MaterialTitle />
            <div className={classes.panel}>
              <MaterialContent />
              <div className="material-page__de-floater" />
              <MaterialButtons />
              <MaterialAssessment />
            </div>
          </>
        )}
        <MaterialMetaFooter />
      </div>
    </MaterialLoaderContainer>
  );
}
