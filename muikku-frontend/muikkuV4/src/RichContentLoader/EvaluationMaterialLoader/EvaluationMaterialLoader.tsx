import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import type { MaterialLoaderConfig, Workspace } from "../coreMaterial";
import { EvaluationMaterialLoaderContainer } from "./EvaluationMaterialLoaderContainer";
import { MaterialContent } from "../coreMaterial/MaterialContent";
import { MaterialAssessment } from "../coreMaterial/MaterialAssessment";
import { MaterialTitle } from "../coreMaterial/MaterialTitle";

/**
 * Props for EvaluationMaterialLoader
 */
export interface EvaluationMaterialLoaderProps {
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;
  folder?: MaterialContentNode;
  modifiers?: string | string[];
  id?: string;
  className?: string;
  config?: Partial<MaterialLoaderConfig>;
  onModification?: () => void;
}

/**
 * EvaluationMaterialLoader - Main component for rendering a evaluation material loader
 * @param props - The props for the MaterialLoader
 * @returns The MaterialLoader
 */
export function EvaluationMaterialLoader(props: EvaluationMaterialLoaderProps) {
  return (
    <EvaluationMaterialLoaderContainer {...props}>
      <div>
        <MaterialTitle />
        <MaterialContent />
        <div className="material-page__de-floater" />
        <MaterialAssessment />
      </div>
    </EvaluationMaterialLoaderContainer>
  );
}
