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
import { MaterialEditingToolbar } from "../coreMaterial/MaterialEditingToolbar";

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
  return (
    <MaterialLoaderContainer {...props}>
      <div>
        <MaterialEditingToolbar />
        <MaterialTitle />
        <MaterialContent />
        <div className="material-page__de-floater" />
        <MaterialButtons />
        <MaterialAssessment />
      </div>
    </MaterialLoaderContainer>
  );
}
