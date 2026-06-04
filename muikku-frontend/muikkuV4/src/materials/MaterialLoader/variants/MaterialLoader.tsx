import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import type { MaterialLoaderConfig, Workspace } from "../core/types";
import { MaterialLoaderTitle } from "../components/MaterialLoaderTitle";
import { MaterialLoaderContent } from "../components/MaterialLoaderContent";
import { MaterialLoaderButtons } from "../components/MaterialLoaderButtons";
import { MaterialLoaderAssessment } from "../components/MaterialLoaderAssessment";
import { MaterialLoaderContainer } from "../core/MaterialLoaderContainer";

/**
 * Props for MaterialLoaderVariant
 */
export interface MaterialLoaderVariantProps {
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
 * MaterialLoader - Main component for rendering a material loader
 * @param props - The props for the MaterialLoader
 * @returns The MaterialLoader
 */
export function MaterialLoader(props: MaterialLoaderVariantProps) {
  return (
    <MaterialLoaderContainer {...props}>
      <div>
        <MaterialLoaderTitle />
        <MaterialLoaderContent />
        <div className="material-page__de-floater" />
        <MaterialLoaderButtons />
        <MaterialLoaderAssessment />
      </div>
    </MaterialLoaderContainer>
  );
}
