import type { IframeDataset } from "../../core/types";

/**
 * IFrameProps
 */
interface IFrameProps {
  element: HTMLElement;
  dataset: IframeDataset;
  invisible?: boolean;
  path: string;
  children: React.ReactNode;
}

/**
 * IFrame
 * @param props props
 * @returns IFrame
 */
export default function IFrame(_props: IFrameProps) {
  return <div>IFrame</div>;
}
