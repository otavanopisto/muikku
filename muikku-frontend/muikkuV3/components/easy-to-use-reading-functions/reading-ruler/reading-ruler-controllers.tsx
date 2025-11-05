import * as React from "react";
import { IconButton } from "~/components/general/button";
import Dropdown from "../../general/dropdown";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
            <div>{t("wcag.closeRulersToolbar")}</div>
          ) : (
            <div>{t("wcag.openRulersToolbar")}</div>
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
        <Dropdown openByHover content={<div>{t("wcag.closeRuler")}</div>}>
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
