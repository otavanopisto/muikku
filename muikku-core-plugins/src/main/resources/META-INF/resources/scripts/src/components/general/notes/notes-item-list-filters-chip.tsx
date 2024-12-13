import * as React from "react";
import { useTranslation } from "react-i18next";
import { NotesItemFilters } from "~/@types/notes";
import Button from "~/components/general/button";

/**
 * NotesItemListProps
 */
interface NotesItemListFiltterChipProps {
  label: string;
  modifier?: string;
  activeModifier?: string;
  name?: keyof NotesItemFilters;
  onChipClick?: (name: keyof NotesItemFilters) => void;
}

const defaultProps = {
  colour: "brown",
};

/**
 * Creater NotesItemPriorityChip component
 * @param props props
 * @returns JSX.Element
 */
const NotesItemFilterChip: React.FC<NotesItemListFiltterChipProps> = (
  props
) => {
  props = { ...defaultProps, ...props };

  const { t } = useTranslation("tasks");

  const { onChipClick, activeModifier, modifier, label } = props;

  /**
   * handleChipClick
   * @param name name
   */
  const handleChipClick =
    (name: keyof NotesItemFilters) =>
    (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (onChipClick) {
        onChipClick(name);
      }
    };

  const priorityButtonModifiers = ["note-priority"];
  if (modifier) {
    priorityButtonModifiers.push(modifier);
  }
  if (activeModifier) {
    priorityButtonModifiers.push(activeModifier);
  }

  return (
    <Button
      as="div"
      role="button"
      aria-label={t("wcag.prioritySorter", { priorityName: label })}
      aria-pressed={!!activeModifier}
      buttonModifiers={priorityButtonModifiers}
      onClick={handleChipClick(props.name)}
    >
      {label}
    </Button>
  );
};

export default NotesItemFilterChip;
