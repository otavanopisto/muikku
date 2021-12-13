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
  const getDimensions = () => ({
    width: myRef.current.offsetWidth,
    height: myRef.current.offsetHeight,
  });

  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (myRef.current) {
      setDimensions(getDimensions());
    }
  }, [myRef]);

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
  const getBoundings = () => ({
    left: myRef.current.getBoundingClientRect().left,
    right: myRef.current.getBoundingClientRect().right,
    top: myRef.current.getBoundingClientRect().top,
    bottom: myRef.current.getBoundingClientRect().bottom,
  });

  const [boundings, setBoundings] = React.useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  });

  React.useEffect(() => {
    if (myRef.current) {
      setBoundings(getBoundings());
    }
  }, [myRef]);

  return boundings;
};
