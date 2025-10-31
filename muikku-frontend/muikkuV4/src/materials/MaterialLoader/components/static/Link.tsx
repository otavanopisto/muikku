import type {
  EnhancedHTMLToReactComponentRule,
  LinkDataset,
} from "../../core/types";

/**
 * LinkProps
 */
interface LinkProps {
  element: HTMLElement;
  dataset: LinkDataset;
  invisible?: boolean;
  path: string;
  processingRules: EnhancedHTMLToReactComponentRule[];
}

/**
 * WordDefinition
 * @param props props
 * @returns WordDefinition
 */
export default function Link(_props: LinkProps) {
  return <div>Link</div>;
}
