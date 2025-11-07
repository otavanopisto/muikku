import type {
  EnhancedHTMLToReactComponentRule,
  ImageDataset,
} from "../../core/types";

/**
 * ImageProps
 */
interface ImageProps {
  element: HTMLElement;
  dataset: ImageDataset;
  invisible?: boolean;
  path: string;
  processingRules: EnhancedHTMLToReactComponentRule[];
}

/**
 * Image
 * @param props props
 * @returns Image
 */
export default function Image(_props: ImageProps) {
  return <div>Image</div>;
}
