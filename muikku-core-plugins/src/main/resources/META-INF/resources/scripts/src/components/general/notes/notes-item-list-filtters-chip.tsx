import * as React from "react";
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
 * Creater NotesItem list component
 * @param props props
 * @returns JSX.Element
 */
const NotesItemPriorityChip: React.FC<NotesItemListFiltterChipProps> = (
  props
) => {
  props = { ...defaultProps, ...props };

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
      buttonModifiers={priorityButtonModifiers}
      onClick={handleChipClick(props.name)}
    >
      {label}
    </Button>
  );
};

export default NotesItemPriorityChip;
