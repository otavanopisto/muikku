import type { WordDefinitionDataset } from "../../core/types";

/**
 * WordDefinitionProps
 */
interface WordDefinitionProps {
  dataset: WordDefinitionDataset;
  invisible?: boolean;
  children: React.ReactNode;
}

/**
 * WordDefinition
 * @param props props
 * @returns WordDefinition
 */
export default function WordDefinition(_props: WordDefinitionProps) {
  return <div>WordDefinition</div>;
}
