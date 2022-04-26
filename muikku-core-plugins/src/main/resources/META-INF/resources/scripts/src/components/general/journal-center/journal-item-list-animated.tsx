import * as React from "react";
import calculateBoundingBoxes from "./helpers/calculateBoundingBoxes";
import usePrevious from "./hooks/usePrevious";

/**
 * JournalListProps
 */
interface JournalListAnimatedProps {
  isLoadingList: boolean;
}

/**
 * Creater Journal list component
 * @param props props
 * @returns JSX.Element
 */
const JournalListAnimated: React.FC<JournalListAnimatedProps> = (props) => {
  const { children, isLoadingList } = props;

  const listElementRef = React.useRef();

  const [boundingBox, setBoundingBox] = React.useState<Record<string, DOMRect>>(
    {}
  );

  const [prevBoundingBox, setPrevBoundingBox] = React.useState<
    Record<string, DOMRect>
  >({});

  const prevChildren = usePrevious(children);

  React.useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes(children, listElementRef);
    setBoundingBox(newBoundingBox);
  }, [children]);

  React.useLayoutEffect(() => {
    const prevBoundingBox = calculateBoundingBoxes(
      prevChildren,
      listElementRef
    );
    setPrevBoundingBox(prevBoundingBox);
  }, [prevChildren]);

  React.useEffect(() => {
    const hasPrevBoundingBox = Object.keys(prevBoundingBox).length;

    if (hasPrevBoundingBox) {
      React.Children.forEach(children, (child: any) => {
        const domNode = child.ref.current;

        const firstBox = prevBoundingBox[child.key];
        const lastBox = boundingBox[child.key];

        if (lastBox && firstBox) {
          const changeInY = firstBox.top - lastBox.top;

          if (changeInY) {
            requestAnimationFrame(() => {
              // Before the DOM paints, invert child to old position
              domNode.style.transform = `translateY(${changeInY}px)`;
              domNode.style.transition = "transform 0s";

              requestAnimationFrame(() => {
                // After the previous frame, remove
                // the transistion to play the animation
                domNode.style.transform = "";
                domNode.style.transition = "transform 500ms";
              });
            });
          }
        }
      });
    }
  }, [boundingBox, prevBoundingBox, children]);

  if (isLoadingList) {
    return <div className="loader-empty" />;
  }

  return (
    //const { children } = props;

    <div ref={listElementRef} className="journal-list-container">
      {children}
    </div>
  );
};
export default JournalListAnimated;
