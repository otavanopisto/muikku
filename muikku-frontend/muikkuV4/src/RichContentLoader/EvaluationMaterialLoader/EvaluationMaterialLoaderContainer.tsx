import type { ReactNode } from "react";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import type { MaterialLoaderConfig, Workspace } from "../coreMaterial/types";
import { EvaluationMaterialLoaderCore } from "./EvaluationMaterialLoaderCore";
import { useMaterialClassName } from "../coreMaterial/hooks/useMaterialLoaderUtils";

/**
 * EvaluationMaterialLoaderContainerProps
 */
interface EvaluationMaterialLoaderContainerProps {
  material: MaterialContentNode;
  workspace: Workspace;
  compositeReplies?: MaterialCompositeReply;
  assignment?: WorkspaceMaterial;
  folder?: MaterialContentNode;
  modifiers?: string | string[];
  id?: string;
  className?: string;
  config?: Partial<MaterialLoaderConfig>;
  children: ReactNode;
}

/**
 * Page shell: article + classNames, then Core (provider)
 */
export function EvaluationMaterialLoaderContainer(
  props: EvaluationMaterialLoaderContainerProps
) {
  const {
    material,
    workspace,
    compositeReplies,
    assignment,
    folder,
    modifiers,
    config,
    id,
    className,
    children,
  } = props;

  // Evaluation specific config
  const mergedConfig: MaterialLoaderConfig = {
    ...config,
    readOnly: true, // <--- evaluation is always read only
    answerable: false, // <--- evaluation is always not answerable
    showAnswers: true, // <--- evaluation is always shows correct answers
    checkAnswers: true, // <--- evaluation is always checks answers
    enableButtons: false,
  };

  const baseClassName = useMaterialClassName(material, modifiers, folder);
  const compositeStateClass = compositeReplies?.state
    ? ` state-${compositeReplies.state}`
    : "";
  const customClass = className ? ` ${className}` : "";
  const articleClassName = `${baseClassName}${compositeStateClass}${customClass}`;

  return (
    <article id={id} className={articleClassName}>
      <EvaluationMaterialLoaderCore
        material={material}
        workspace={workspace}
        compositeReplies={compositeReplies}
        assignment={assignment}
        config={mergedConfig}
      >
        {children}
      </EvaluationMaterialLoaderCore>
    </article>
  );
}
