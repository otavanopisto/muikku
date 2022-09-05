import * as React from "react";
import { IconButton } from "~/components/general/button";

/**
 * ReadingRulerControllersProps
 */
interface ReadingRulerControllersProps {
  tools: React.ReactNode;
  /* presets: React.ReactNode; */
  onClose: () => void;
}

/**
 * ReadingRulerControllers
 */
export const ReadingRulerControllers = React.forwardRef<
  HTMLDivElement,
  ReadingRulerControllersProps
>((props, ref) => {
  const { tools, onClose } = props;

  const [toolsDrawerOpen, setToolsDrawerOpen] = React.useState(false);

  /**
   * handleShowToolsClick
   * @param e e
   */
  const handleShowToolsClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setToolsDrawerOpen(!toolsDrawerOpen);
  };

  return (
    <div ref={ref} className="reading-ruler-controllers">
      <IconButton onClick={handleShowToolsClick} icon="arrow-left" />
      <div
        className={`${
          toolsDrawerOpen
            ? "reading-ruler-controllers-settings-container reading-ruler-controllers-settings-container--open"
            : "reading-ruler-controllers-settings-container"
        }`}
      >
        {tools}
      </div>
      {onClose && <IconButton icon="cross" onClick={onClose} />}
    </div>
  );
});

ReadingRulerControllers.displayName = "ReadingRulerControllers";
