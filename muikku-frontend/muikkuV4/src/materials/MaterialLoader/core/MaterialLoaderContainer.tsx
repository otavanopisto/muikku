import type {
  MaterialCompositeReply,
  MaterialContentNode,
  WorkspaceMaterial,
} from "~/generated/client";
import type { MaterialLoaderConfig, Workspace } from "../core/types";
import { defaultConfig } from "../configs/MaterialLoaderConfigs";
import { MaterialLoaderCore } from "./MaterialLoaderCore";
import { useMaterialClassName } from "./hooks/useMaterialLoaderUtils";
import type { ReactNode } from "react";

/**
 * Props for MaterialLoaderVariant
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
  onModification?: () => void;
  children: ReactNode;
}

/**
 * MaterialLoaderContainer - Main component for rendering a material loader container
 * @param props - The props for the MaterialLoader
 * @returns The MaterialLoader
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
    onModification,
    id,
    className,
    children,
  } = props;
  const mergedConfig: MaterialLoaderConfig = { ...defaultConfig, ...config };
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
        onModification={onModification}
      >
        {children}
      </MaterialLoaderCore>
    </article>
  );
}
