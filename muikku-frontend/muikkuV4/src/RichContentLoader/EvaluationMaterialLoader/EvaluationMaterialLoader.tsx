import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import type { MaterialLoaderConfig, Workspace } from "../coreMaterial";
import {
  MaterialLoaderAssessment,
  MaterialLoaderContent,
  MaterialLoaderTitle,
} from "~/src/materials/MaterialLoader";
import { EvaluationMaterialLoaderContainer } from "./EvaluationMaterialLoaderContainer";

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
        <MaterialLoaderTitle />
        <MaterialLoaderContent />
        <div className="material-page__de-floater" />
        <MaterialLoaderAssessment />
      </div>
    </EvaluationMaterialLoaderContainer>
  );
}
