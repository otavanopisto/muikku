import type { ReactNode } from "react";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import type {
  MaterialEditingConfig,
  MaterialEditingHandlers,
  MaterialLoaderConfig,
  Workspace,
} from "../coreMaterial/types";
import { MaterialLoaderCore } from "./MaterialLoaderCore";
import { useMaterialClassName } from "../coreMaterial/hooks/useMaterialLoaderUtils";

/**
 * MaterialLoaderContainerProps
 */
export interface MaterialLoaderContainerProps {
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
  children: ReactNode;
}

/**
 * Page shell: article + classNames, then Core (provider)
 */
export function MaterialLoaderContainer(props: MaterialLoaderContainerProps) {
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

  const mergedConfig: MaterialLoaderConfig = {
    ...config,
  };

  const baseClassName = useMaterialClassName(material, modifiers, folder);
  const compositeStateClass = compositeReplies?.state
    ? ` state-${compositeReplies.state}`
    : "";
  const customClass = className ? ` ${className}` : "";
  const articleClassName = `${baseClassName}${compositeStateClass}${customClass}`;

  return (
    <article id={id} className={articleClassName}>
      <MaterialLoaderCore
        material={material}
        workspace={workspace}
        compositeReplies={compositeReplies}
        assignment={assignment}
        config={mergedConfig}
      >
        {children}
      </MaterialLoaderCore>
    </article>
  );
}
