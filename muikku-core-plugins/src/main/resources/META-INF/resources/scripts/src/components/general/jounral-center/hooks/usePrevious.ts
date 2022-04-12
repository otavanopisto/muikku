import * as React from "react";

/**
 * usePrevious
 * @param value value
 */
const usePrevious = <T>(value: T): T | undefined => {
  const ref = React.useRef<T>();

  React.useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default usePrevious;
