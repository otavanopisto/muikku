import * as React from "react";
/**
 * useDimensions
 * Custom hook to return dimensions of wanted element
 * @param myRef element reference
 * @returns dimension values of width and height
 */
export const useDimensions = (
  myRef: React.MutableRefObject<HTMLDivElement | HTMLTableElement>
) => {
  /**
   * getDimensions
   * @returns Dimensions
   */
  const getDimensions = React.useCallback(
    () => ({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight,
    }),
    [myRef]
  );

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    setDimensions(getDimensions());
  }, [getDimensions]);

  return dimensions;
};

/**
 * useElementBoundings
 * Custom hook to return bounding values of wanted element
 * @param myRef element reference
 * @returns object with bounding values of right and left
 */
export const useElementBoundings = (
  myRef: React.MutableRefObject<HTMLDivElement | HTMLTableElement>
) => {
  /**
   * getBoundings
   * @returns Boundings
   */
  const getBoundings = React.useCallback(
    () => ({
      left: myRef.current.getBoundingClientRect().left,
      right: myRef.current.getBoundingClientRect().right,
      top: myRef.current.getBoundingClientRect().top,
      bottom: myRef.current.getBoundingClientRect().bottom,
    }),
    [myRef]
  );

  const [boundings, setBoundings] = React.useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  React.useEffect(() => {
    setBoundings(getBoundings());
  }, [getBoundings]);

  return boundings;
};
