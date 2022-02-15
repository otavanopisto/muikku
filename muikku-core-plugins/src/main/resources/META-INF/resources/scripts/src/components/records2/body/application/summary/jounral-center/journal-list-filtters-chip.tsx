import * as React from "react";
import { JournalFiltters } from "~/@types/journal-center";

/**
 * JournalListProps
 */
interface JournalListFiltterChipProps {
  label: string;
  colour?: string;
  name?: keyof JournalFiltters;
  onChipClick?: (name: keyof JournalFiltters) => void;
}

const defaultProps = {
  colour: "brown",
};

/**
 * Creater Journal list component
 * @param props props
 * @returns JSX.Element
 */
const JournalPriorityChip: React.FC<JournalListFiltterChipProps> = (props) => {
  props = { ...defaultProps, ...props };

  const { onChipClick, colour, label } = props;

  /**
   * handleChipClick
   * @param name name
   */
  const handleChipClick =
    (name: keyof JournalFiltters) =>
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (onChipClick) {
        onChipClick(name);
      }
    };

  return (
    <div
      onClick={handleChipClick(props.name)}
      style={{
        height: "30px",
        width: "fit-content",
        backgroundColor: colour,
        display: "flex",
        padding: "5px",
        alignItems: "center",
        borderRadius: "10px",
        marginRight: "5px",
        cursor: "pointer",
      }}
    >
      {label}
    </div>
  );
};

export default JournalPriorityChip;
