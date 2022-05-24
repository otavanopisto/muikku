import * as React from "react";

/**
 * calculateBoundingBoxes
 * @param children children
 * @param currentParentElement children
 */
const calculateBoundingBoxes = (
  children: any,
  currentParentElement: React.MutableRefObject<HTMLDivElement>
) => {
  const boundingBoxes: Record<string, DOMRect> = {};

  React.Children.forEach(children, (child: any) => {
    const domNode = child.ref.current;

    if (domNode) {
      const nodeBoundingBox = domNode.getBoundingClientRect();

      const top =
        nodeBoundingBox.top -
        currentParentElement.current.getBoundingClientRect().top;

      const bottom =
        nodeBoundingBox.bottom -
        currentParentElement.current.getBoundingClientRect().bottom;

      boundingBoxes[child.key] = {
        ...nodeBoundingBox,
        top: top,
        bottom: bottom,
      };
    }
  });

  return boundingBoxes;
};

export default calculateBoundingBoxes;
