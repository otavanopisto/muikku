import * as React from "react";

export default function useComponentVisible(initialIsVisible: boolean) {
  const [isComponentVisible, setIsComponentVisible] =
    React.useState(initialIsVisible);
  const ref = React.useRef(null);

  const handleClickOutside = (e: Event) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsComponentVisible(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
