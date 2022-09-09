import * as React from "react";
import { IconButton } from "~/components/general/button";
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "../../general/dropdown";

/**
 * ReadingRulerControllersProps
 */
interface ReadingRulerControllersProps {
  tools: React.ReactNode;
  i18n: i18nType;
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
  const { tools, onClose, i18n } = props;

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
      <Dropdown
        openByHover
        content={
          toolsDrawerOpen ? (
            <div>
              {i18n.text.get(
                "plugin.wcag.readingRuler.actions.closeRulersToolbar"
              )}
            </div>
          ) : (
            <div>
              {i18n.text.get(
                "plugin.wcag.readingRuler.actions.closeRulersToolbar"
              )}
            </div>
          )
        }
      >
        <IconButton
          buttonModifiers={["reading-ruler"]}
          onClick={handleShowToolsClick}
          icon={toolsDrawerOpen ? "arrow-right" : "arrow-left"}
        />
      </Dropdown>
      <div
        className={`${
          toolsDrawerOpen
            ? "reading-ruler-controllers-settings-container reading-ruler-controllers-settings-container--open"
            : "reading-ruler-controllers-settings-container"
        }`}
      >
        {tools}
      </div>
      {onClose && (
        <Dropdown
          openByHover
          content={
            <div>
              {i18n.text.get(
                "plugin.wcag.readingRuler.actions.closeRuler"
              )}
            </div>
          }
        >
          <IconButton
            icon="cross"
            onClick={onClose}
            buttonModifiers={["reading-ruler"]}
          />
        </Dropdown>
      )}
    </div>
  );
});

ReadingRulerControllers.displayName = "ReadingRulerControllers";
