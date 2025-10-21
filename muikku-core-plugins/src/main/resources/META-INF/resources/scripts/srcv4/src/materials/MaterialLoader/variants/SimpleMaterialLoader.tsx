import { type ProcessingRule } from "../core/processors/HTMLProcessor";
import { defaultProcessingRules } from "../core/processors/ProcessingRules";
import { MaterialLoaderCore } from "../core/MaterialLoaderCore";
import {
  defaultConfig,
  type MaterialLoaderConfig,
} from "../configs/MaterialLoaderConfigs";
import { MaterialLoaderTitle } from "../components/MaterialLoaderTitle";
import { MaterialLoaderContent } from "../components/MaterialLoaderContent";

/**
 * SimpleMaterialLoaderProps
 */
interface SimpleMaterialLoaderProps {
  html?: string;
  material?: { html: string; title?: string };
  processingRules?: ProcessingRule[];
  modifiers?: string | string[];
}

/**
 *
 * @param param0
 * @returns
 */
export function SimpleMaterialLoader(props: SimpleMaterialLoaderProps) {
  const {
    html,
    material,
    processingRules = defaultProcessingRules,
    modifiers,
  } = props;

  const contentToProcess = html ?? material?.html;
  /* const processedContent = useContentProcessor(
    contentToProcess,
    processingRules
  ); */

  const config: MaterialLoaderConfig = {
    ...defaultConfig,
    readOnly: true,
    answerable: false,
    processingRules: processingRules || defaultConfig.processingRules,
    modifiers,
  };

  const materialObj = {
    id: "simple",
    title: material?.title ?? "Simple Material",
    html: contentToProcess ?? "",
    assignmentType: "THEORY" as const,
  };

  // eslint-disable-next-line no-console
  console.log("materialObj", materialObj);

  return (
    <MaterialLoaderCore material={materialObj} config={config}>
      <div>
        <MaterialLoaderTitle />
        <MaterialLoaderContent />
      </div>
    </MaterialLoaderCore>
  );
}
